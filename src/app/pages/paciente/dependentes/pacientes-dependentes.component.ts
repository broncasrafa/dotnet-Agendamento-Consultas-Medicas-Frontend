import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroupDirective } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { NgxMaskDirective } from 'ngx-mask';
import { BsModalService } from 'src/app/shared/services/bs-modal.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CryptoService } from 'src/app/shared/services/crypto.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { PacienteDependenteService } from 'src/app/core/services/paciente-dependente.service';
import { PacienteDependenteResponse } from 'src/app/core/models/paciente/response/PacienteDependenteResponse';
import { ConvenioMedicoResponse } from 'src/app/core/models/convenio-medico/response/ConvenioMedicoResponse';
import { AppUtils } from 'src/app/core/utils/app.util';
import { DateFormattedPipe } from 'src/app/shared/pipes/date-formatted.pipe';
import { TelefoneFormattedPipe } from 'src/app/shared/pipes/telefone-formatted.pipe';
import { IdadeFormattedPipe } from 'src/app/shared/pipes/idade-formatted.pipe';
import { DisplayValidationErrorsComponent } from 'src/app/shared/components/display-validation-errors/display-validation-errors.component';
import { cpfValidator, dateOfBirthFormatValidator, fullNameValidator, phoneNumberValidator } from 'src/app/core/utils/form-validators.util';
import { PlanosMedicoResponse } from 'src/app/core/models/paciente/response/PlanosMedicoResponse';
import { CreatePacienteDependenteRequest } from 'src/app/core/models/paciente/request/CreatePacienteDependenteRequest';
import { DeletePacienteDependenteRequest } from 'src/app/core/models/paciente/request/DeletePacienteDependenteRequest';

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
  private authService = inject(AuthenticationService);
  private notificationService = inject(NotificationService);
  private pacienteService = inject(PacienteService);
  private pacienteDependenteService = inject(PacienteDependenteService);
  private cryptoService = inject(CryptoService);
  private modalService = inject(BsModalService);


  isModalFechado = false;
  dependentes: PacienteDependenteResponse[]=[];
  conveniosMedicos: ConvenioMedicoResponse[] = [];
  pacienteId: number;
  dependenteId: number;


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

      this.pacienteDependenteService.createPacienteDependente(request)
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
    const id = this.cryptoService.criptografar(dependenteId);
    const pacientePrincipalId = this.cryptoService.criptografar(this.pacienteId);
    this.router.navigate(['/paciente/dependente/' + id], {
      queryParams: {
        pacientePrincipalId: pacientePrincipalId
      }
    });
  }

  onclick_ShowModalRemoverDadosDependente(dependenteId: number) {
    this.dependenteId = dependenteId;
    this.modalService.abrirModal('modalDeleteDependente');
  }
  onclick_RemoverDadosDependente(dependenteId: number) {
    const request = {
      dependenteId: dependenteId,
      pacientePrincipalId: this.pacienteId
    } as DeletePacienteDependenteRequest;

    this.pacienteDependenteService.deletePacienteDependente(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (!AppUtils.isNullOrUndefined(response) && response) {
            AppUtils.removerItemNaListaById(this.dependentes, dependenteId);
            this.modalService.fecharModal('modalDeleteDependente');
            this.notificationService.showSuccessNotification('Deletar', 'Dependente removido com sucesso');
          }
        },
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      })
  }
}
