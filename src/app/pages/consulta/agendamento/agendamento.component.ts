import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { AppUtils } from 'src/app/core/utils/app.util';
import { CommonService } from 'src/app/core/services/common.service';
import { CryptoService } from 'src/app/shared/services/crypto.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { EspecialidadeService } from 'src/app/core/services/especialidade.service';
import { EspecialistaService } from 'src/app/core/services/especialista.service';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { EspecialistaResponse } from 'src/app/core/models/especialista/response/EspecialistaResponse';
import { PacienteResponse } from 'src/app/core/models/paciente/response/PacienteResponse';
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
    DisplayValidationErrorsComponent
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
  private especialidadeService = inject(EspecialidadeService);
  private especialistaService = inject(EspecialistaService);
  private pacienteService = inject(PacienteService);
  private commonService = inject(CommonService);
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
    dependenteId: ['', [Validators.required] ],
    planoMedicoId: ['', [Validators.required] ],

    dataConsulta: ['', [Validators.required] ],
    horarioConsulta: ['', [Validators.required] ],
    motivoConsulta: ['', [Validators.required] ],
    valorConsulta: ['', [Validators.required] ],
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
    const pacienteId = this.authService.getUserInfo().id;
    this.pacienteService.getPacienteById(pacienteId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) =>  {
          this.paciente = response!
          console.log(this.paciente)
        },
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      })
  }

  onCriarAgendamento(formDirective: FormGroupDirective) {

  }

  on_click_radioTipoAgendamento(event: any) {
    const id = event.target.value;
    if (id == '1') {
      // Resetar o valor de convenioSelecionado quando o tipo de agendamento for alterado para 'particular'
      this.agendamentoForm.patchValue({
        planoMedicoId: ''
      });
    }
  }
}
