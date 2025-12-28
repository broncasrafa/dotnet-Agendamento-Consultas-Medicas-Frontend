import { Component, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { Offcanvas } from 'bootstrap';
import { AutocompleteSearchComponent } from 'src/app/shared/components/autocomplete-search/autocomplete-search.component';
import { DropdownPesquisarEspecialidadesComponent } from 'src/app/pages/especialidades/dropdown-pesquisar-especialidades/dropdown-pesquisar-especialidades.component';
import { EspecialidadeResponse } from 'src/app/core/models/especialidade/response/EspecialidadeResponse';
import { ConvenioMedicoResponse } from 'src/app/core/models/convenio-medico/response/ConvenioMedicoResponse';
import { CidadeResponse } from 'src/app/core/models/common/request/CidadeResponse';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';


export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SearchStepperResult {
  especialidadeId: string | number;
  cidadeId: string | number;
  formaPagamento: string | number;
  convenioMedicoId: string | number;
}

// aproveitando o bundle JS já referenciado no index.html
declare const bootstrap: any;

@Component({
  selector: 'app-pesquisar-especialista-stepper',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AutocompleteSearchComponent,
    DropdownPesquisarEspecialidadesComponent
  ],
  templateUrl: './pesquisar-especialista-stepper.component.html',
  styleUrl: './pesquisar-especialista-stepper.component.css'
})
export class PesquisarEspecialistaStepperComponent implements OnInit, OnDestroy {
  @Input() especialidades: EspecialidadeResponse[] = [];
  @Input() cidades: CidadeResponse[] = [];
  @Input() conveniosMedicos: ConvenioMedicoResponse[] = [];

  @Output() requestData = new EventEmitter<any>();

  /**
   * Caso queira inicializar com valores já selecionados
   * (ex.: quando clicar em "Editar busca")
   */
  @Input() initialValues?: Partial<SearchStepperResult>;

  /**
   * Evento disparado quando o formulário é válido e o usuário clica em "Salvar e avançar".
   */
  @Output() searchResult = new EventEmitter<any>();

  @ViewChild('offcanvasEditarBusca') offcanvasEditarBusca!: ElementRef;
  private offcanvasInstance?: Offcanvas;

  @ViewChild('conveniosMedicosInput')
  conveniosMedicosInput?: any;

  private destroy$ = new Subject<void>();
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthenticationService);
  private notificationService = inject(NotificationService);

  form!: FormGroup;
  especialidadesOptions: SelectOption[] = [];
  cidadesOptions: SelectOption[] = [];
  // controle de etapas
  currentStep = 1;

  // Testes
  placeholderEspecialidadeText = 'Digite uma especialidade';
  placeholderCidadeText = 'Procure por uma cidade';
  placeholderConvenioMedicoText = 'Digite o nome do convênio médico';
  especialidadeSelecionada: any = null;
  cidadeSelecionada: any = null;
  convenioMedicoSelecionada: any = null;
  pagamentoParticularSelecionado: boolean = false;



  constructor() {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.especialidadesOptions = this.especialidades.map(e => ({ value: e.id, label: e.nome }));
    this.cidadesOptions = this.cidades.map(c => ({ value: c.cidadeId, label: c.descricaoFormatada }));
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngAfterViewInit(): void {
    if (this.offcanvasEditarBusca) {
      this.offcanvasInstance = new bootstrap.Offcanvas(
        this.offcanvasEditarBusca.nativeElement
      );
    }
  }

  // Controle do offcanvas
  openOffcanvas() {
    this.currentStep = 1;
    this.initializeForm();
    this.form.markAsPristine();
    this.form.markAsUntouched();

    this.offcanvasInstance?.show();
  }
  onclick_fechar_offcanvas_editar_busca() {
    this.offcanvasInstance?.hide();
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      especialidadeId: [this.initialValues?.especialidadeId ?? '', [Validators.required]],
      cidadeId: [this.initialValues?.cidadeId ?? '', [Validators.required]],
      formaPagamento: [this.initialValues?.formaPagamento ?? '', Validators.required],
      convenioMedicoId: [this.initialValues?.convenioMedicoId ?? '']
    });
  }

  get totalSteps(): number {
    return 3;
  }

  get progress(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  // Regras de habilitação do botão do footer
  get canGoNext(): boolean {
    if (this.currentStep === 1) {
      return this.form.get('especialidadeId')?.valid ?? false;
    }

    if (this.currentStep === 2) {
      return this.form.get('cidadeId')?.valid ?? false;
    }

    if (this.currentStep === 3) {
      const stepValido = this.form.get('convenioMedicoId')?.valid || this.form.get('formaPagamento')?.valid;
      return stepValido ?? false;
    }

    return false;
  }

  get primaryButtonText(): string {
    return this.currentStep < this.totalSteps
      ? 'Próximo'
      : 'Salvar e avançar';
  }

  get isValid(): boolean {
    return this.form.valid;
  }

  // Navegação entre etapas
  goToNextStep(): void {
    if (!this.canGoNext) {
      this.markCurrentStepAsTouched();
      return;
    }

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  goToPreviousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  private markCurrentStepAsTouched(): void {
    if (this.currentStep === 1) {
      this.form.get('especialidadeId')?.markAsTouched();
    } else if (this.currentStep === 2) {
      this.form.get('cidadeId')?.markAsTouched();
    } else if (this.currentStep === 3) {
      this.form.get('formaPagamento')?.markAsTouched();
    }
  }

  onPrimaryButtonClick(): void {
    if (this.currentStep < this.totalSteps) {
      this.goToNextStep();
      return;
    }

    // última etapa -> salvar e avançar
    if (!this.canGoNext) {
      this.markCurrentStepAsTouched();
      return;
    }

    this.onclick_salvar_avancar();
  }

  //  salvar e avançar (etapa final)
  onclick_salvar_avancar(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const result: SearchStepperResult = this.form.getRawValue();
    const cidade = this.cidades.find(c => c.cidadeId == result.cidadeId);

    this.searchResult.emit({
      especialidadeId: result.especialidadeId,
      cidade: cidade?.descricao,
      estado: cidade?.siglaEstado,
      formaPagamento: result.formaPagamento,
      convenioMedicoId: result.convenioMedicoId
    });

    // fecha o offcanvas após emitir o evento
    this.offcanvasInstance?.hide();
  }


  formatEspecialidade(item: any) {
    return item.nome;
  }
  formatCidade(cidade: CidadeResponse): string {
    return cidade.descricaoFormatada;
  }
  formatConvenioMedico(convenioMedico: ConvenioMedicoResponse): string {
    return convenioMedico.nome;
  }
  onEspecialidadeSelecionada(especialidade: EspecialidadeResponse) {
    this.especialidadeSelecionada = especialidade;
    this.form.patchValue({ especialidadeId: especialidade?.id ?? '' });
  }
  onCidadeSelecionada(cidade: CidadeResponse) {
    this.cidadeSelecionada = cidade;
    this.form.patchValue({ cidadeId: cidade?.cidadeId ?? '' });
  }
  onConvenioMedicoSelecionado(convenioMedico: ConvenioMedicoResponse) {
    this.convenioMedicoSelecionada = convenioMedico;
    this.pagamentoParticularSelecionado = false;
    this.form.patchValue({ convenioMedicoId: convenioMedico?.id ?? ''});
    this.form.patchValue({ formaPagamento: 2 }); // valor fixo para indicar convenio medico
  }
  onPagamentoParticularSelecionado() {
    this.pagamentoParticularSelecionado = true;
    this.convenioMedicoSelecionada = null;
    this.form.patchValue({ convenioMedicoId: '' }); // zerar o convenio medico
    this.form.patchValue({ formaPagamento: 1 }); // valor fixo para indicar pagamento particular
    this.conveniosMedicosInput?.clear();
    this.form.get('convenioMedicoId')?.markAsPristine();
    this.form.get('convenioMedicoId')?.markAsUntouched();
  }
  // Captura quando o usuário apaga o campo manualmente
  onEspecialidadeInput(event: any) {
    if (!event.target.value) {
      this.especialidadeSelecionada = null;
    }
  }
  onCidadeInput(event: any) {
    if (!event.target.value) {
      this.cidadeSelecionada = null;
    }
  }
  onConvenioMedicoInput(event: any) {
    if (!event.target.value) {
      this.convenioMedicoSelecionada = null;
    }
  }
  onConvenioMedicoFocus() {
    this.pagamentoParticularSelecionado = false;
  }
}
