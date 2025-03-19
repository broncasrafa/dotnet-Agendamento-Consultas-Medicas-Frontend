import { Component, ElementRef, inject, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Modal } from 'bootstrap';
import { NgxMaskDirective } from 'ngx-mask';
import { BsModalService } from 'src/app/shared/services/bs-modal.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { AccountService } from 'src/app/core/services/account.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { ConvenioMedicoService } from 'src/app/core/services/convenio-medico.service';
import { PacienteDependenteResponse } from 'src/app/core/models/paciente/response/PacienteDependenteResponse';
import { ConvenioMedicoResponse } from 'src/app/core/models/convenio-medico/response/ConvenioMedicoResponse';
import { AppUtils } from 'src/app/core/utils/app.util';
import { CpfFormattedPipe } from 'src/app/shared/pipes/cpf-formatted.pipe';
import { DateFormattedPipe } from 'src/app/shared/pipes/date-formatted.pipe';
import { TelefoneFormattedPipe } from 'src/app/shared/pipes/telefone-formatted.pipe';
import { IdadeFormattedPipe } from 'src/app/shared/pipes/idade-formatted.pipe';
import { DisplayValidationErrorsComponent } from 'src/app/shared/components/display-validation-errors/display-validation-errors.component';
import { cpfValidator, dateOfBirthFormatValidator, fullNameValidator, matchEmailsValidator, matchPasswordsValidator, passwordComplexityValidator, phoneNumberValidator } from 'src/app/core/utils/form-validators.util';
import { PlanosMedicoResponse } from 'src/app/core/models/paciente/response/PlanosMedicoResponse';
import { CreatePacienteDependenteRequest } from 'src/app/core/models/paciente/request/CreatePacienteDependenteRequest';

@Component({
  selector: 'app-pacientes-dependentes',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    DisplayValidationErrorsComponent,
    NgxMaskDirective,
    CpfFormattedPipe,
    DateFormattedPipe,
    TelefoneFormattedPipe,
    IdadeFormattedPipe
  ],
  templateUrl: './pacientes-dependentes.component.html',
  styleUrl: './pacientes-dependentes.component.css'
})
export class PacientesDependentesComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthenticationService);
  private accountService = inject(AccountService);
  private notificationService = inject(NotificationService);
  private pacienteService = inject(PacienteService);
  private convenioMedicoService = inject(ConvenioMedicoService);
  private modalService = inject(BsModalService);


  isModalFechado = false;
  dependentes: PacienteDependenteResponse[]=[];
  conveniosMedicos: ConvenioMedicoResponse[] = [];
  pacienteId: number;
  planoMedicoId: number;


  formAddDependente = this.formBuilder.group({
    pacientePrincipalId: [0, [Validators.required]],
    nomeCompleto: ['', [Validators.required, fullNameValidator]],
    email: ['', [Validators.required]],
    genero: ['', [Validators.required]],
    dataNascimento: ['', [Validators.required, dateOfBirthFormatValidator(false)]],
    cpf: ['', [Validators.required, cpfValidator]],
    telefone: ['', [Validators.required, phoneNumberValidator]],
  });


  constructor() {
    const userLogged = this.authService.getUserInfo();
    this.pacienteId = userLogged.id!;
    this.formAddDependente.controls.pacientePrincipalId.setValue(this.pacienteId);

    this.obterListaDependentesPaciente();
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadDataIsReady() {
    return !AppUtils.isNullOrUndefined(this.dependentes);
  }
  isNullOrEmpty(value: any): boolean {
    return AppUtils.isNullOrEmpty(value);
  }
  isNullOrUndefined(value: any): boolean {
    return AppUtils.isNullOrUndefined(value);
  }


  obterListaDependentesPaciente() {
    this.pacienteService.getDependentesPaciente(this.pacienteId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.dependentes = response;
          console.log(this.dependentes)
        },
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      });
  }


  formatPlanosMedicos(planosMedicos: PlanosMedicoResponse[]) {
    return planosMedicos.map(c => c.convenioMedico).join(', ');
  }

  onclick_ShowModalAdicionarDependente() {
    this.modalService.abrirModal('modalAddDependente');
  }
  onclick_AdicionarDependente(formDirective: FormGroupDirective) {
    if (this.formAddDependente.valid) {
      const request = this.formAddDependente.value as CreatePacienteDependenteRequest;
      request.dataNascimento = AppUtils.convertToDateFormat(request.dataNascimento.replace('/','').replace('/',''));

      this.pacienteService.createPacienteDependente(request)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.modalService.fecharModal('modalAddDependente');
            this.notificationService.showSuccessNotification('Cadastro', 'Dados cadastrados com sucesso');
            this.obterListaDependentesPaciente();
          },
          error: err => this.notificationService.showHttpResponseErrorNotification(err)
        });
    }
  }

  onclick_editarDadosDependente(dependenteId: number) {

  }

  onclick_ShowModalRemoverDadosDependente(dependenteId: number) {
    this.modalService.abrirModal('modalDeleteDependente');
  }
  onclick_RemoverDadosDependente(dependenteId: number) {

  }
}
