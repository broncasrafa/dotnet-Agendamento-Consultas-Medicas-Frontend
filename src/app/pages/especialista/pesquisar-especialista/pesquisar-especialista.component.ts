import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Modal, Offcanvas } from 'bootstrap';
import { AppUtils } from 'src/app/core/utils/app.util';
import { StringExtensions } from 'src/app/core/extensions/string.extensions';
import { IsNullOrUndefinedPipe } from 'src/app/shared/pipes/is-null-or-undefined.pipe';
import { NumberThousandsFormattedPipe } from 'src/app/shared/pipes/number-thousands-formatted.pipe';
import { RatingStarsComponent } from 'src/app/shared/components/rating-stars/rating-stars.component';
import { HorariosAgendamento, ListarHorariosDisponiveisComponent } from 'src/app/pages/especialista/listar-horarios-disponiveis/listar-horarios-disponiveis.component';
import { PesquisarEspecialistaStepperComponent } from 'src/app/pages/especialista/pesquisar-especialista-stepper/pesquisar-especialista-stepper.component';
import { ResultResponseEmptyComponent } from 'src/app/shared/components/result-response-empty/result-response-empty.component';
import { EspecialistaResponse } from 'src/app/core/models/especialista/response/EspecialistaResponse';
import { EspecialidadeResponse } from 'src/app/core/models/especialidade/response/EspecialidadeResponse';
import { ConvenioMedicoResponse } from 'src/app/core/models/convenio-medico/response/ConvenioMedicoResponse';
import { CidadeResponse } from 'src/app/core/models/common/request/CidadeResponse';
import { EspecialistaService } from 'src/app/core/services/especialista.service';
import { EspecialidadeService } from 'src/app/core/services/especialidade.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CryptoService } from 'src/app/shared/services/crypto.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { BsModalService } from 'src/app/shared/services/bs-modal.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ConvenioMedicoService } from 'src/app/core/services/convenio-medico.service';
import { GenericSimpleModalComponent, ModalSize } from 'src/app/shared/components/generic-simple-modal/generic-simple-modal.component';

@Component({
  selector: 'app-pesquisar-especialista',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    RatingStarsComponent,
    ListarHorariosDisponiveisComponent,
    PesquisarEspecialistaStepperComponent,
    ResultResponseEmptyComponent,
    GenericSimpleModalComponent,
    IsNullOrUndefinedPipe,
    NumberThousandsFormattedPipe
  ],
  templateUrl: './pesquisar-especialista.component.html',
  styleUrl: './pesquisar-especialista.component.css'
})
export class PesquisarEspecialistaComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private especialistaService = inject(EspecialistaService);
  private especialidadeService = inject(EspecialidadeService);
  private notificationService = inject(NotificationService);
  private cryptoService = inject(CryptoService);
  private commonService = inject(CommonService);
  private convenioMedicoService = inject(ConvenioMedicoService);
  private loadingService = inject(LoadingService);
  private modalService = inject(BsModalService);

  especialidades: EspecialidadeResponse[] = [];
  cidades: CidadeResponse[] = [];
  conveniosMedicos: ConvenioMedicoResponse[] = [];

  cidade: string | null = null;
  estado: string | null = null;
  especialidadeId: number | null = null;
  convenioMedicoId: number = 0;
  especialidade: string | null = null;
  especialistas: EspecialistaResponse[] = [];
  showDemaisEspecialidades: { [key: number]: boolean } = {};
  totalItems = 0;
  paginaAtual = 1; // Página inicial
  carregando = false; // Flag para controlar requisição
  temMaisItens = true; // Flag para desativar o botão se não houver mais itens
  modalInstance?: Modal;
  conveniosAtendidos: string[] = [];
  horarios: HorariosAgendamento[] = [
    {
      data: '2025-12-19',
      horarios: ["09:00", "09:30", "10:00", "10:30"]
    },
    {
      data: '2025-12-20',
      horarios: ["08:00", "09:00", "09:30", "10:00", "10:30", "11:00", "12:00"]
    },
    {
      data: '2025-12-21',
      horarios: ["08:30", "09:00", "09:30", "10:00", "10:30"]
    },
    {
      data: '2025-12-22',
      horarios: ["08:00", "09:00", "09:30", "10:00", "10:30"]
    },
    {
      data: '2025-12-23',
      horarios: ["08:00", "09:00", "09:30", "10:00", "10:30"]
    },
    {
      data: '2025-12-24',
      horarios: ["08:00", "09:00", "09:30", "10:00", "10:30"]
    },
    {
      data: '2025-12-25',
      horarios: ["08:00", "09:00", "09:30", "10:00", "10:30"]
    },
    {
      data: '2025-12-26',
      horarios: ["08:00", "09:00", "09:30", "10:00", "10:30"]
    },
  ];

  readonly ModalSize = ModalSize;

  constructor() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.paginaAtual = 1; // reinicia a paginação a cada nova busca
      this.cidade = params['cidade'] || null;
      this.estado = params['estado'] || null;
      this.especialidadeId = params['especialidadeId'] ? Number(params['especialidadeId']) : null;
      this.convenioMedicoId = params['convenioMedicoId'] ? Number(params['convenioMedicoId']) : 0;

      if (StringExtensions.isNullOrWhiteSpace(this.cidade) || this.especialidadeId == null || StringExtensions.isNullOrWhiteSpace(this.estado)) {
        this.router.navigateByUrl('/404-page')
      }

      this.getEspecialidadesList();
      this.getCidadesList();
      this.getConveniosMedicosList();
      this.pesquisarEspecialistas();
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isNullOrUndefined(value: any): boolean {
    return AppUtils.isNullOrUndefined(value);
  }
  isNullOrEmpty(value: any): boolean {
    return AppUtils.isNullOrEmpty(value);
  }
  isArrayNullOrEmpty(value: any[]): boolean {
    return AppUtils.isArrayNullOrEmpty<any>(value);
  }

  getEspecialidadesList() {
    this.especialidadeService.getEspecialidades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.especialidades = response;
          this.especialidade = response.find(c => c.id == this.especialidadeId)!.nome
        },
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      })
  }

  getCidadesList() {
    this.commonService.getCidades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.cidades = response,
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      });
  }

  getConveniosMedicosList() {
    this.convenioMedicoService.getConveniosMedicos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.conveniosMedicos = response,
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      });
  }

  pesquisarEspecialistas() {
    this.especialistaService.getEspecialistasByFilter(Number(this.especialidadeId), this.convenioMedicoId, this.cidade!, this.paginaAtual)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (resp: any) => {
        if (!AppUtils.isNullOrUndefined(resp)) {
          this.especialistas = resp.data.results
          this.paginaAtual++;
          this.temMaisItens = resp.data.hasNextPage;
          this.totalItems = resp.data.total;
        }
      },
      error: err => this.notificationService.showHttpResponseErrorNotification(err)
    });
  }

  carregarMaisEspecialistas() {
    if (this.carregando || !this.temMaisItens)
      return;

    this.carregando = true;

    this.especialistaService.getEspecialistasByFilter(Number(this.especialidadeId), this.convenioMedicoId, this.cidade!, this.paginaAtual)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (resp: any) => {
        if (!AppUtils.isNullOrUndefined(resp) && resp.data.results.length > 0) {
          this.especialistas = [...this.especialistas, ...resp.data.results]; // Concatena os novos itens
          this.paginaAtual++;
          this.temMaisItens = resp.data.hasNextPage;
          this.carregando = false;
        } else {
          this.carregando = false;
          this.temMaisItens = false;
        }
      },
      error: err => this.notificationService.showHttpResponseErrorNotification(err)
    });
  }

  onclick_DetalhesEspecialista(especialistaId: Number) {

    this.router.navigate(['/especialista', this.cryptoService.criptografar(especialistaId)]);
  }

  receberHorarioSelecionado(evento: { data: string, horario: string, especialistaId: Number }) {
    const queryParameters = this.cryptoService.criptografar(evento);

    this.router.navigate(['/agendamento'], {
      queryParams: {
        filters: queryParameters
      }
    });
  }

  // Alterna o estado de showDemaisEspecialidades para o item com o id correspondente
  mostrarMaisEspecialidades(id: number) {
    this.showDemaisEspecialidades[id] = !this.showDemaisEspecialidades[id];
  }

  obterDemaisEspecialidadesString(especialidades: EspecialidadeResponse[]) {
    const demais = especialidades.filter(especialidade => especialidade.id !== this.especialidadeId);
    return demais.map((c) => c.nome).join(', ');
  }
  obterEspecialidadesParametroString(especialidades: EspecialidadeResponse[]) {
    return especialidades.find(c => c.id == this.especialidadeId)?.nome
  }

  abrirModalConveniosAtendidos(convenios: ConvenioMedicoResponse[]) {
    this.conveniosAtendidos = [];
    this.conveniosAtendidos = convenios.map((c) => c.nome);

    const modalElement = document.getElementById('modalConvenios');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  edit_search_result_event(event: any) {
    //console.log('Novo evento recebido:', event);
    this.router.navigate(['/especialistas/pesquisa'], {
        queryParams: {
          cidade: event.cidade,
          estado: event.estado,
          especialidadeId: event.especialidadeId,
          convenioMedicoId: event.convenioMedicoId
        }
    });
  }
}
