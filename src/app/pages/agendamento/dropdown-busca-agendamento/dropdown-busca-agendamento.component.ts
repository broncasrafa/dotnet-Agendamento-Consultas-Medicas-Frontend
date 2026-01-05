import { Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil} from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { ConvenioMedicoService } from 'src/app/core/services/convenio-medico.service';
import { EspecialidadeService } from 'src/app/core/services/especialidade.service';
import { SintomasEDoencasService } from 'src/app/core/services/sintomas-e-doencas.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AppUtils } from 'src/app/core/utils/app.util';
import { CidadeResponse } from 'src/app/core/models/common/request/CidadeResponse';
import { ConvenioMedicoResponse } from 'src/app/core/models/convenio-medico/response/ConvenioMedicoResponse';


type DropdownKind = 'agenda' | 'cidade' | 'convenio' | null;

type AgendaType = 'especialidade' | 'sintoma-doenca';

export interface AgendaItemSimple {
  type: AgendaType;
  id: number;
  name: string;
}

export interface ItemSimple {
  type: string;
  id: number;
  name: string;
}

export interface BuscaAgendamentoPayload {
  especialidadeId: number;
  sintomaDoencaId: number;
  convenioMedicoId: number;
  cidade: string;
  estado: string;
}

@Component({
  selector: 'app-dropdown-busca-agendamento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dropdown-busca-agendamento.component.html',
  styleUrl: './dropdown-busca-agendamento.component.css'
})
export class DropdownBuscaAgendamentoComponent implements OnInit, OnDestroy {

  private convenioMedicoService = inject(ConvenioMedicoService);
  private especialidadeService = inject(EspecialidadeService);
  private commonService = inject(CommonService);
  private sintomasDoencasService = inject(SintomasEDoencasService);
  private notificationService  = inject(NotificationService);
  private formBuilder = inject(FormBuilder);

  private destroy$ = new Subject<void>();

  @Output() buscar = new EventEmitter<BuscaAgendamentoPayload>();

  @ViewChild('root', { static: true }) rootRef!: ElementRef<HTMLElement>;
  @ViewChild('agendaInput', { static: true }) agendaInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('agendaDropdown') agendaDropdownRef?: ElementRef<HTMLElement>;
  @ViewChild('cidadeInput', { static: true }) cidadeInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('cidadeDropdown') cidadeDropdownRef?: ElementRef<HTMLElement>;
  @ViewChild('convenioInput', { static: true }) convenioInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('convenioDropdown') convenioDropdownRef?: ElementRef<HTMLElement>;

  openDropdown: DropdownKind = null;

  agendaDropdownStyle: { top: string; left: string; width: string } | null = null;
  cidadeDropdownStyle: { top: string; left: string; width: string } | null = null;
  convenioDropdownStyle: { top: string; left: string; width: string } | null = null;

  readonly requiredMsg = 'Busque e escolha uma opção';

  // Form: por enquanto só o primeiro campo, depois adicionamos cidade e convênio.
  form = this.formBuilder.group({
    agendaText: ['', [Validators.required]],
    cidadeText: ['', [Validators.required]],
    convenioText: ['', [Validators.required]]
  });

  cidades: CidadeResponse[] = [];
  conveniosMedicos: ConvenioMedicoResponse[] = [];

  // ---------- dropdown 1 ----------
  agendaAll: AgendaItemSimple[] = [];      // array único (cache)
  agendaFiltered: AgendaItemSimple[] = []; // exibido no dropdown
  cidadeAll: ItemSimple[] = [];      // array único (cache)
  cidadeFiltered: ItemSimple[] = []; // exibido no dropdown
  convenioAll: ItemSimple[] = [];      // array único (cache)
  convenioFiltered: ItemSimple[] = []; // exibido no dropdown

  selectedAgenda: AgendaItemSimple | null = null;
  selectedCidade: ItemSimple | null = null;
  selectedConvenio: ItemSimple | null = null;

  // Se quiser limitar itens no dropdown pra ficar leve
  readonly maxResults = 30;

  agendaPage = 1;
  cidadePage = 1;
  convenioPage = 1;

  readonly ddlItemsPerPage = 15;

  private isSelectingAgenda = false;
  private isSelectingCidade = false;
  private isSelectingConvenio = false;

  ngOnInit(): void {
    this.loadAgendaCache();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =========================
  // Carrega caches e monta array único
  // =========================
  private loadAgendaCache(): void {
    // Especialidades (cache completo)
    this.especialidadeService.getEspecialidades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any[]) => {
          const especialidades = (response ?? []).map(e => ({
            type: 'especialidade' as const,
            id: e.id ?? e.Id,
            name: (e.nome ?? e.Nome ?? e.descricao ?? e.Descricao ?? '').toString()
          }));

          // junta com o que já tem (sintomas podem chegar antes/depois)
          this.mergeAgenda(especialidades);
        },
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      });

    // Sintomas/Doenças (cache completo)
    this.sintomasDoencasService.getSintomasDoencasCache()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any[]) => {
          const sintomas = (response ?? []).map(s => ({
            type: 'sintoma-doenca' as const,
            id: s.id ?? s.Id,
            name: (s.nome ?? s.Nome ?? s.descricao ?? s.Descricao ?? '').toString()
          }));

          this.mergeAgenda(sintomas);
        },
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      });

    // cidades (cache completo)
    this.commonService.getCidades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any[]) => {
          this.cidades = response;
          const cidades = (response ?? []).map(c => ({
            type: 'cidade' as const,
            id: c.cidadeId,
            name: c.descricaoFormatada
          }));

          this.mergeCidade(cidades);
        },
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      });

    // Especialidades (cache completo)
    this.convenioMedicoService.getConveniosMedicos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any[]) => {
          this.conveniosMedicos = response;
          const conveniosMedicos = (response ?? []).map(c => ({
            type: 'convenio-medico' as const,
            id: c.id,
            name: c.nome
          }));

          this.mergeConvenio(conveniosMedicos);
        },
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      });
  }

  private mergeAgenda(items: AgendaItemSimple[]): void {
    // merge simples sem duplicar por (type,id)
    const mapKey = (x: AgendaItemSimple) => `${x.type}:${x.id}`;

    const current = new Map(this.agendaAll.map(x => [mapKey(x), x] as const));
    for (const it of items) current.set(mapKey(it), it);

    this.agendaAll = Array.from(current.values());

    // se usuário já digitou algo, refaz filtro; senão mostra os primeiros
    const term = (this.form.get('agendaText')?.value ?? '').toString();
    this.filterAgenda(term);
  }
  private mergeCidade(items: ItemSimple[]): void {
    // merge simples sem duplicar por (type,id)
    const mapKey = (x: ItemSimple) => `${x.type}:${x.id}`;

    const current = new Map(this.cidadeAll.map(x => [mapKey(x), x] as const));
    for (const it of items) current.set(mapKey(it), it);

    this.cidadeAll = Array.from(current.values());

    // se usuário já digitou algo, refaz filtro; senão mostra os primeiros
    const term = (this.form.get('cidadeText')?.value ?? '').toString();
    this.filterCidade(term);
  }
  private mergeConvenio(items: ItemSimple[]): void {
    // merge simples sem duplicar por (type,id)
    const mapKey = (x: ItemSimple) => `${x.type}:${x.id}`;

    const current = new Map(this.convenioAll.map(x => [mapKey(x), x] as const));
    for (const it of items) current.set(mapKey(it), it);

    this.convenioAll = Array.from(current.values());

    // se usuário já digitou algo, refaz filtro; senão mostra os primeiros
    const term = (this.form.get('convenioText')?.value ?? '').toString();
    this.filterConvenio(term);
  }

  private filterAgenda(termRaw: string): void {
    const term = (termRaw ?? '').trim().toLowerCase();

    const normalizedSearch = AppUtils.normalizarTexto(termRaw);

    const baseList = !normalizedSearch
      ? this.agendaAll
      : this.agendaAll.filter(item => {
        const normalizedName = AppUtils.normalizarTexto(item.name);
        return normalizedName.includes(normalizedSearch);
      });

    this.agendaFiltered = baseList.slice(0, this.agendaPage * this.ddlItemsPerPage);
  }
  private filterCidade(termRaw: string): void {
    const term = (termRaw ?? '').trim().toLowerCase();

    const normalizedSearch = AppUtils.normalizarTexto(termRaw);

    const baseList = !normalizedSearch
      ? this.cidadeAll
      : this.cidadeAll.filter(item => {
        const normalizedName = AppUtils.normalizarTexto(item.name);
        return normalizedName.includes(normalizedSearch);
      });

    this.cidadeFiltered = baseList.slice(0, this.cidadePage * this.ddlItemsPerPage);
  }
  private filterConvenio(termRaw: string): void {
    const term = (termRaw ?? '').trim().toLowerCase();

    const normalizedSearch = AppUtils.normalizarTexto(termRaw);

    const baseList = !normalizedSearch
      ? this.convenioAll
      : this.convenioAll.filter(item => {
        const normalizedName = AppUtils.normalizarTexto(item.name);
        return normalizedName.includes(normalizedSearch);
      });

    this.convenioFiltered = baseList.slice(0, this.convenioPage * this.ddlItemsPerPage);
  }

  // =========================
  // Abrir/fechar dropdown
  // =========================
  open(kind: DropdownKind): void {
    this.openDropdown = kind;

    if (kind === 'agenda') {
      // quando abrir, mostra lista conforme o termo atual
      const term = (this.form.get('agendaText')?.value ?? '').toString();
      this.filterAgenda(term);
    }

    if (kind === 'cidade') {
      // quando abrir, mostra lista conforme o termo atual
      const term = (this.form.get('cidadeText')?.value ?? '').toString();
      this.filterCidade(term);
    }

    if (kind === 'convenio') {
      // quando abrir, mostra lista conforme o termo atual
      const term = (this.form.get('convenioText')?.value ?? '').toString();
      this.filterConvenio(term);
    }
  }

  closeAll(): void {
    this.openDropdown = null;
  }

  toggleAgenda(ev: MouseEvent): void {
    ev.preventDefault();
    ev.stopPropagation();

    this.openDropdown = this.openDropdown === 'agenda' ? null : 'agenda';

    if (this.openDropdown === 'agenda') {
      const term = (this.form.get('agendaText')?.value ?? '').toString();
      this.filterAgenda(term);
    }
  }

  // fecha ao clicar fora
  @HostListener('document:mousedown', ['$event'])
  onDocumentMouseDown(ev: MouseEvent): void {
    const target = ev.target as Node;

    const clickedOnAgendaInput = this.agendaInputRef?.nativeElement?.contains(target) ?? false;
    const clickedOnAgendaDropdown = this.agendaDropdownRef?.nativeElement?.contains(target) ?? false;
    const clickedOnCidadeInput = this.cidadeInputRef?.nativeElement?.contains(target) ?? false;
    const clickedOnCidadeDropdown = this.cidadeDropdownRef?.nativeElement?.contains(target) ?? false;
    const clickedOnConvenioInput = this.convenioInputRef?.nativeElement?.contains(target) ?? false;
    const clickedOnConvenioDropdown = this.convenioDropdownRef?.nativeElement?.contains(target) ?? false;

    const clickedInsideAny =
      clickedOnAgendaInput ||
      clickedOnAgendaDropdown ||
      clickedOnCidadeInput ||
      clickedOnCidadeDropdown ||
      clickedOnConvenioInput ||
      clickedOnConvenioDropdown;

    if (!clickedInsideAny) {
      this.closeAll();
    }
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.closeAll();
  }

  // =========================
  // Input do dropdown 1
  // =========================
  openAgenda(ev?: MouseEvent): void {
    ev?.stopPropagation();

    this.openDropdown = 'agenda';
    this.agendaPage = 1;

    const input = this.agendaInputRef.nativeElement;
    const rect = input.getBoundingClientRect();

    this.agendaDropdownStyle = {
      top: '187px', //`${rect.bottom + 8}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`
    };
    // this.agendaDropdownStyle = {
    //   top: '187px',
    //   left: '110.993px',
    //   width: '400px'
    // };

    const term = (this.form.get('agendaText')?.value ?? '').toString();
    this.filterAgenda(term);

    // ======= INÍCIO: garantir destaque do item selecionado ao reabrir =======
    // Se o item selecionado não estiver na "página" atual, a classe is-selected
    // não terá onde aplicar. Então, se houver seleção, garantimos que ele apareça:
    if (this.selectedAgenda) {
      const existsInFiltered = this.agendaFiltered.some(x =>
        x.type === this.selectedAgenda!.type && x.id === this.selectedAgenda!.id
      );

      if (!existsInFiltered) {
        // aumenta a paginação local até incluir o item (ou até não ter mais)
        const maxPages = Math.ceil(this.agendaAll.length / this.ddlItemsPerPage);
        let guard = 0;

        while (!this.agendaFiltered.some(x =>
          x.type === this.selectedAgenda!.type && x.id === this.selectedAgenda!.id
        ) && this.agendaPage < maxPages && guard < 50) {
          this.agendaPage += 1;
          this.filterAgenda(term);
          guard += 1;
        }
      }

      // opcional: se estiver na lista, traz para o topo pra ficar bem visível
      const idx = this.agendaFiltered.findIndex(x =>
        x.type === this.selectedAgenda!.type && x.id === this.selectedAgenda!.id
      );

      if (idx > 0) {
        const [sel] = this.agendaFiltered.splice(idx, 1);
        this.agendaFiltered.unshift(sel);
      }
    }
    // ======= FIM =======
  }

  onAgendaFocus(): void {
    this.open('agenda');
  }

  onAgendaClick(): void {
    this.open('agenda');
  }

  onAgendaInput(ev: Event): void {
    if (this.isSelectingAgenda) return;

    const value = (ev.target as HTMLInputElement | null)?.value ?? '';
    this.selectedAgenda = null;

    this.agendaPage = 1;
    this.filterAgenda(value);

    this.openDropdown = 'agenda';
  }

  onAgendaScroll(ev: Event): void {
    const el = ev.target as HTMLElement;

    const nearBottom =
      el.scrollTop + el.clientHeight >= el.scrollHeight - 20;

    if (!nearBottom) return;

    const term = (this.form.get('agendaText')?.value ?? '').toString();
    this.agendaPage += 1;

    this.filterAgenda(term);
  }

  selectAgenda(item: AgendaItemSimple, ev?: MouseEvent): void {
    ev?.preventDefault();
    ev?.stopPropagation();

    this.isSelectingAgenda = true;

    this.selectedAgenda = item;
    this.form.get('agendaText')?.setValue(item.name);

    const ctrl = this.form.get('agendaText');
    ctrl?.setValue(item.name);
    ctrl?.markAsDirty();
    ctrl?.markAsTouched();

    this.closeAll();

    // libera no próximo tick
    setTimeout(() => (this.isSelectingAgenda = false), 0);
  }

  isAgendaSelected(it: AgendaItemSimple): boolean {
    return !!this.selectedAgenda
      && this.selectedAgenda.type === it.type
      && this.selectedAgenda.id === it.id;
  }

  showAgendaRequiredError(): boolean {
    const ctrl = this.form.get('agendaText');
    if (!ctrl) return false;

    // regra: precisa ter item selecionado (não basta texto)
    return (ctrl.touched || ctrl.dirty) && !this.selectedAgenda;
  }

  canClearAgenda(): boolean {
    const value = this.form.get('agendaText')?.value;
    return !!value || !!this.selectedAgenda;
  }

  clearAgenda(ev: MouseEvent): void {
    ev.preventDefault();
    ev.stopPropagation();

    this.selectedAgenda = null;

    const ctrl = this.form.get('agendaText');
    ctrl?.setValue('');
    ctrl?.markAsDirty();
    ctrl?.markAsTouched();

    this.closeAll();

    this.openAgenda();
  }





  // =========================
  // Input do dropdown 2
  // =========================
  openCidade(ev?: MouseEvent): void {
    ev?.stopPropagation();

    this.openDropdown = 'cidade';
    this.cidadePage = 1;

    const input = this.cidadeInputRef.nativeElement;
    const rect = input.getBoundingClientRect();

    this.cidadeDropdownStyle = {
      top: '187px', //`${rect.bottom + 8}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`
    };
    // this.cidadeDropdownStyle = {
    //   top: '187px',
    //   left: '480px',
    //   width: '400px'
    // };

    const term = (this.form.get('cidadeText')?.value ?? '').toString();
    this.filterCidade(term);

    // ======= INÍCIO: garantir destaque do item selecionado ao reabrir =======
    // Se o item selecionado não estiver na "página" atual, a classe is-selected
    // não terá onde aplicar. Então, se houver seleção, garantimos que ele apareça:
    if (this.selectedCidade) {
      const existsInFiltered = this.cidadeFiltered.some(x =>
        x.type === this.selectedCidade!.type && x.id === this.selectedCidade!.id
      );

      if (!existsInFiltered) {
        // aumenta a paginação local até incluir o item (ou até não ter mais)
        const maxPages = Math.ceil(this.cidadeAll.length / this.ddlItemsPerPage);
        let guard = 0;

        while (!this.cidadeFiltered.some(x =>
          x.type === this.selectedCidade!.type && x.id === this.selectedCidade!.id
        ) && this.cidadePage < maxPages && guard < 50) {
          this.cidadePage += 1;
          this.filterCidade(term);
          guard += 1;
        }
      }

      // opcional: se estiver na lista, traz para o topo pra ficar bem visível
      const idx = this.cidadeFiltered.findIndex(x =>
        x.type === this.selectedCidade!.type && x.id === this.selectedCidade!.id
      );

      if (idx > 0) {
        const [sel] = this.cidadeFiltered.splice(idx, 1);
        this.cidadeFiltered.unshift(sel);
      }
    }
    // ======= FIM =======
  }

  onCidadeFocus(): void {
    this.open('cidade');
  }

  onCidadeClick(): void {
    this.open('cidade');
  }

  onCidadeInput(ev: Event): void {
    if (this.isSelectingCidade) return;

    const value = (ev.target as HTMLInputElement | null)?.value ?? '';
    this.selectedCidade = null;

    this.cidadePage = 1;
    this.filterCidade(value);

    this.openDropdown = 'cidade';
  }

  onCidadeScroll(ev: Event): void {
    const el = ev.target as HTMLElement;

    const nearBottom =
      el.scrollTop + el.clientHeight >= el.scrollHeight - 20;

    if (!nearBottom) return;

    const term = (this.form.get('cidadeText')?.value ?? '').toString();
    this.cidadePage += 1;

    this.filterCidade(term);
  }

  selectCidade(item: ItemSimple, ev?: MouseEvent): void {
    ev?.preventDefault();
    ev?.stopPropagation();

    this.isSelectingCidade = true;

    this.selectedCidade = item;
    this.form.get('cidadeText')?.setValue(item.name);

    const ctrl = this.form.get('cidadeText');
    ctrl?.setValue(item.name);
    ctrl?.markAsDirty();
    ctrl?.markAsTouched();

    this.closeAll();

    // libera no próximo tick
    setTimeout(() => (this.isSelectingCidade = false), 0);
  }

  isCidadeSelected(it: ItemSimple): boolean {
    return !!this.selectedCidade
      && this.selectedCidade.type === it.type
      && this.selectedCidade.id === it.id;
  }

  showCidadeRequiredError(): boolean {
    const ctrl = this.form.get('cidadeText');
    if (!ctrl) return false;

    // regra: precisa ter item selecionado (não basta texto)
    return (ctrl.touched || ctrl.dirty) && !this.selectedCidade;
  }

  canClearCidade(): boolean {
    const value = this.form.get('cidadeText')?.value;
    return !!value || !!this.selectedCidade;
  }

  clearCidade(ev: MouseEvent): void {
    ev.preventDefault();
    ev.stopPropagation();

    this.selectedCidade = null;

    const ctrl = this.form.get('cidadeText');
    ctrl?.setValue('');
    ctrl?.markAsDirty();
    ctrl?.markAsTouched();

    this.closeAll();

    this.openCidade();
  }


  // =========================
  // Input do dropdown 3
  // =========================
  openConvenio(ev?: MouseEvent): void {
    ev?.stopPropagation();

    this.openDropdown = 'convenio';
    this.convenioPage = 1;

    const input = this.convenioInputRef.nativeElement;
    const rect = input.getBoundingClientRect();

    this.convenioDropdownStyle = {
      top: '187px', //`${rect.bottom + 8}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`
    };
    // this.convenioDropdownStyle = {
    //   top: '187px',
    //   left: '894px',
    //   width: '370px'
    // };

    const term = (this.form.get('convenioText')?.value ?? '').toString();
    this.filterConvenio(term);

    // ======= INÍCIO: garantir destaque do item selecionado ao reabrir =======
    // Se o item selecionado não estiver na "página" atual, a classe is-selected
    // não terá onde aplicar. Então, se houver seleção, garantimos que ele apareça:
    if (this.selectedConvenio) {
      const existsInFiltered = this.convenioFiltered.some(x =>
        x.type === this.selectedConvenio!.type && x.id === this.selectedConvenio!.id
      );

      if (!existsInFiltered) {
        // aumenta a paginação local até incluir o item (ou até não ter mais)
        const maxPages = Math.ceil(this.convenioAll.length / this.ddlItemsPerPage);
        let guard = 0;

        while (!this.convenioFiltered.some(x =>
          x.type === this.selectedConvenio!.type && x.id === this.selectedConvenio!.id
        ) && this.convenioPage < maxPages && guard < 50) {
          this.convenioPage += 1;
          this.filterConvenio(term);
          guard += 1;
        }
      }

      // opcional: se estiver na lista, traz para o topo pra ficar bem visível
      const idx = this.convenioFiltered.findIndex(x =>
        x.type === this.selectedConvenio!.type && x.id === this.selectedConvenio!.id
      );

      if (idx > 0) {
        const [sel] = this.convenioFiltered.splice(idx, 1);
        this.convenioFiltered.unshift(sel);
      }
    }
    // ======= FIM =======
  }

  onConvenioFocus(): void {
    this.open('convenio');
  }

  onConvenioClick(): void {
    this.open('convenio');
  }

  onConvenioInput(ev: Event): void {
    if (this.isSelectingConvenio) return;

    const value = (ev.target as HTMLInputElement | null)?.value ?? '';
    this.selectedConvenio = null;

    this.convenioPage = 1;
    this.filterConvenio(value);

    this.openDropdown = 'convenio';
  }

  onConvenioScroll(ev: Event): void {
    const el = ev.target as HTMLElement;

    const nearBottom =
      el.scrollTop + el.clientHeight >= el.scrollHeight - 20;

    if (!nearBottom) return;

    const term = (this.form.get('convenioText')?.value ?? '').toString();
    this.convenioPage += 1;

    this.filterConvenio(term);
  }

  selectConvenio(item: ItemSimple, ev?: MouseEvent): void {
    ev?.preventDefault();
    ev?.stopPropagation();

    this.isSelectingConvenio = true;

    this.selectedConvenio = item;
    this.form.get('convenioText')?.setValue(item.name);

    const ctrl = this.form.get('convenioText');
    ctrl?.setValue(item.name);
    ctrl?.markAsDirty();
    ctrl?.markAsTouched();

    this.closeAll();

    // libera no próximo tick
    setTimeout(() => (this.isSelectingConvenio = false), 0);
  }

  isConvenioSelected(it: ItemSimple): boolean {
    return !!this.selectedConvenio
      && this.selectedConvenio.type === it.type
      && this.selectedConvenio.id === it.id;
  }

  showConvenioRequiredError(): boolean {
    const ctrl = this.form.get('convenioText');
    if (!ctrl) return false;

    // regra: precisa ter item selecionado (não basta texto)
    return (ctrl.touched || ctrl.dirty) && !this.selectedConvenio;
  }

  canClearConvenio(): boolean {
    const value = this.form.get('convenioText')?.value;
    return !!value || !!this.selectedConvenio;
  }

  clearConvenio(ev: MouseEvent): void {
    ev.preventDefault();
    ev.stopPropagation();

    this.selectedConvenio = null;

    const ctrl = this.form.get('convenioText');
    ctrl?.setValue('');
    ctrl?.markAsDirty();
    ctrl?.markAsTouched();

    this.closeAll();

    this.openConvenio();
  }

  // =========================
  // Buscar (mantive payload completo, mas por enquanto só preenche o campo 1)
  // =========================
  onBuscarClick(): void {
    this.form.markAllAsTouched();

    // Aqui a regra do dropdown 1: obrigatório ter um item selecionado (não só texto)
    if (!this.selectedAgenda) {
      // marca o control como tocado/dirty para o CSS entrar
      const ctrl = this.form.get('agendaText');
      ctrl?.markAsTouched();
      ctrl?.markAsDirty();

      // opcional: abre o dropdown para ajudar o usuário
      //this.openAgenda();
      return;
    }
    if (!this.selectedCidade) {
      // marca o control como tocado/dirty para o CSS entrar
      const ctrl = this.form.get('cidadeText');
      ctrl?.markAsTouched();
      ctrl?.markAsDirty();

      // opcional: abre o dropdown para ajudar o usuário
      //this.openCidade();
      return;
    }

    const cidade = this.cidades.find(x => x.cidadeId == this.selectedCidade?.id);

    const payload: BuscaAgendamentoPayload = {
      especialidadeId: this.selectedAgenda.type === 'especialidade' ? this.selectedAgenda.id : 0,
      sintomaDoencaId: this.selectedAgenda.type === 'sintoma-doenca' ? this.selectedAgenda.id : 0,
      convenioMedicoId: this.selectedConvenio?.id ?? 0,
      cidade: cidade?.code ?? '',
      estado: cidade?.siglaEstado?.toLowerCase() ?? ''
    };

    this.buscar.emit(payload);
    this.closeAll();
  }

}
