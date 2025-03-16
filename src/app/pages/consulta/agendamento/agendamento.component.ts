import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { NgxMaskDirective } from 'ngx-mask';
import { AppUtils } from 'src/app/core/utils/app.util';
import { CryptoService } from 'src/app/shared/services/crypto.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { EspecialistaService } from 'src/app/core/services/especialista.service';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { AgendamentoService } from 'src/app/core/services/agendamento.service';
import { EspecialistaResponse } from 'src/app/core/models/especialista/response/EspecialistaResponse';
import { PacienteResponse } from 'src/app/core/models/paciente/response/PacienteResponse';
import { CreateAgendamentoRequest } from 'src/app/core/models/agendamento/request/CreateAgendamentoRequest';
import { InputCharacterCountDirective } from 'src/app/shared/directives/input-character-count.directive';
import { DisplayValidationErrorsComponent } from 'src/app/shared/components/display-validation-errors/display-validation-errors.component';

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    InputCharacterCountDirective,
    DisplayValidationErrorsComponent,
    NgxMaskDirective
  ],
  templateUrl: './agendamento.component.html',
  styleUrl: './agendamento.component.css'
})
export class AgendamentoConsultaComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthenticationService);
  private notificationService = inject(NotificationService);
  private especialistaService = inject(EspecialistaService);
  private agendamentoService = inject(AgendamentoService);
  private pacienteService = inject(PacienteService);
  private cryptoService = inject(CryptoService);

  private dadosAgendamento: any;
  public especialista: EspecialistaResponse;
  public paciente: PacienteResponse;
  public dataConsulta: string;


  agendamentoForm = this.formBuilder.group({
    especialistaId: ['', [Validators.required] ],
    especialidadeId: ['', [Validators.required] ],
    localAtendimentoId: ['', [Validators.required] ],
    tipoConsultaId: ['', [Validators.required] ],
    tipoAgendamentoId: ['', [Validators.required] ],
    pacienteId: ['', [Validators.required] ],
    dependenteId: [''],
    planoMedicoId: ['', [Validators.required] ],

    dataConsulta: ['', [Validators.required] ],
    horarioConsulta: ['', [Validators.required] ],
    motivoConsulta: ['', [Validators.required] ],
    valorConsulta: [''],
    telefoneContato: ['', [Validators.required] ],
    primeiraVez: [, [Validators.required] ],
  });

  constructor() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['filters']) {
        this.dadosAgendamento = this.cryptoService.descriptografar(params['filters']);
        console.log(this.dadosAgendamento)
      }
    });
  }

  ngOnInit(): void {
    this.obterDadosEspecialista();
    this.obterDadosPaciente();

    this.dataConsulta = `${AppUtils.formatarDataExtenso(this.dadosAgendamento.data)} às ${this.dadosAgendamento.horario}`;
    this.setValoresFormInit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();// Limpeza de memória
  }

  loadDataIsReady() {
    return this.especialista !== null && this.especialista !== undefined && this.paciente !== null && this.paciente !== undefined;
  }

  isNullOrEmpty(value: any): boolean {
    return AppUtils.isNullOrEmpty(value);
  }

  setValoresFormInit() {
    this.agendamentoForm.controls.especialistaId.setValue(this.dadosAgendamento.especialistaId);
    this.agendamentoForm.controls.dataConsulta.setValue(this.dadosAgendamento.data);
    this.agendamentoForm.controls.horarioConsulta.setValue(this.dadosAgendamento.horario);
  }

  createRequestObj(): CreateAgendamentoRequest {
    var request = {
      especialistaId: Number(this.agendamentoForm.value.especialistaId),
      especialidadeId: Number(this.agendamentoForm.value.especialidadeId),
      localAtendimentoId: Number(this.agendamentoForm.value.localAtendimentoId),
      tipoConsultaId: Number(this.agendamentoForm.value.tipoConsultaId),
      tipoAgendamentoId: Number(this.agendamentoForm.value.tipoAgendamentoId),
      dataConsulta: this.agendamentoForm.value.dataConsulta,
      horarioConsulta: this.agendamentoForm.value.horarioConsulta,
      motivoConsulta: this.agendamentoForm.value.motivoConsulta,
      valorConsulta: this.isNullOrEmpty(this.agendamentoForm.value.valorConsulta) ? 0 : Number(this.agendamentoForm.value.valorConsulta!.replace('.','').replace(',','.')),
      telefoneContato: this.agendamentoForm.value.telefoneContato,
      primeiraVez: !!this.agendamentoForm.value.primeiraVez,
      pacienteId: Number(this.agendamentoForm.value.pacienteId!.split('_').pop()),
      dependenteId: this.isNullOrEmpty(this.agendamentoForm.value.dependenteId) ? null : Number(this.agendamentoForm.value.dependenteId!.split('_').pop()),
      planoMedicoId: Number(this.agendamentoForm.value.planoMedicoId)
    } as CreateAgendamentoRequest;

    return request;
  }

  obterDadosEspecialista() {
    this.especialistaService.getEspecialistaById(this.dadosAgendamento.especialistaId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) =>  {
          this.especialista = response!
          console.log(this.especialista)
        },
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      })
  }

  obterDadosPaciente() {
    const userLoggedInfo = this.authService.getUserInfo();
    const pacienteId = userLoggedInfo.id;
    this.pacienteService.getPacienteById(pacienteId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) =>  {
          this.paciente = response!
          this.agendamentoForm.controls.telefoneContato.setValue(this.paciente.telefone);
          console.log(this.paciente)
        },
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      })
  }

  onclick_CriarAgendamento(formDirective: FormGroupDirective) {
    if (this.agendamentoForm.value && this.agendamentoForm.valid) {
      const request = this.createRequestObj();

      this.agendamentoService.createAgendamento(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.data! > 0) {
            // redirecionar para tela de detalhes do agendamento
            this.notificationService.showSuccessNotification('Agendamento', 'Agendamento realizado com sucesso');
            this.router.navigate(['/paciente/consultas']);
          }
          console.log(response)
        },
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      })
    }
  }

  onclick_radioTipoAgendamento(event: any) {
    const id = event.target.value;
    if (id == '1') {
      // Resetar o valor de convenioSelecionado quando o tipo de agendamento for alterado para 'particular'
      this.agendamentoForm.patchValue({
        planoMedicoId: ''
      });
    }
  }
}
