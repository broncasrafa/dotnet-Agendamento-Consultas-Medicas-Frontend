import { Component, ElementRef, inject, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Modal } from 'bootstrap';
import { NgxMaskDirective } from 'ngx-mask';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { AccountService } from 'src/app/core/services/account.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { ConvenioMedicoService } from 'src/app/core/services/convenio-medico.service';
import { PacienteResponse } from 'src/app/core/models/paciente/response/PacienteResponse';
import { ConvenioMedicoResponse } from 'src/app/core/models/convenio-medico/response/ConvenioMedicoResponse';
import { AppUtils } from 'src/app/core/utils/app.util';
import { CpfFormattedPipe } from 'src/app/shared/pipes/cpf-formatted.pipe';
import { DateFormattedPipe } from 'src/app/shared/pipes/date-formatted.pipe';
import { TelefoneFormattedPipe } from 'src/app/shared/pipes/telefone-formatted.pipe';
import { DisplayValidationErrorsComponent } from 'src/app/shared/components/display-validation-errors/display-validation-errors.component';
import { CreatePacientePlanoMedicoRequest } from 'src/app/core/models/paciente/request/CreatePacientePlanoMedicoRequest';
import { UpdatePacientePlanoMedicoRequest } from 'src/app/core/models/paciente/request/UpdatePacientePlanoMedicoRequest';
import { DeletePacientePlanoMedicoRequest } from 'src/app/core/models/paciente/request/DeletePacientePlanoMedicoRequest';
import { UpdatePacienteRequest } from 'src/app/core/models/paciente/request/UpdatePacienteRequest';
import { UpdateAuthenticatedUserInfoRequest } from 'src/app/core/models/account/request/UpdateAuthenticatedUserInfoRequest';
import { dateOfBirthFormatValidator, fullNameValidator, matchEmailsValidator, phoneNumberValidator } from 'src/app/core/utils/form-validators.util';

import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-dados-conta-paciente',
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
    TelefoneFormattedPipe
  ],
  templateUrl: './dados-conta-paciente.component.html',
  styleUrl: './dados-conta-paciente.component.css'
})
export class DadosContaPacienteComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthenticationService);
  private accountService = inject(AccountService);
  private notificationService = inject(NotificationService);
  private pacienteService = inject(PacienteService);
  private convenioMedicoService = inject(ConvenioMedicoService);

  modalInstance?: Modal | null;
  paciente: PacienteResponse;
  conveniosMedicos: ConvenioMedicoResponse[] = [];
  isModalFechado = false;
  dadosModal: any; // Variável para armazenar os dados do modal
  pacienteId: number;
  planoMedicoId: number;

  formAddConvenioMedico = this.formBuilder.group({
    pacienteId: [0, [Validators.required]],
    convenioMedicoId: [0, [Validators.required]],
    nomePlano: ['', [Validators.required]],
    numCartao: ['', [Validators.required]],
  });

  formUpdateConvenioMedico = this.formBuilder.group({
    pacienteId: [0, [Validators.required]],
    planoMedicoId: [0, [Validators.required]],
    nomePlano: ['', [Validators.required]],
    numeroCarteirinha: ['', [Validators.required]],
  });

  formUpdatePaciente = this.formBuilder.group({
    pacienteId: [0, [Validators.required]],
    nomeCompleto: ['', [Validators.required, fullNameValidator]],
    genero: ['', [Validators.required]],
    telefone: ['', [Validators.required, phoneNumberValidator]],
    dataNascimento: ['', [Validators.required, dateOfBirthFormatValidator(false)]],
    email: ['', [Validators.required]],
  });

  formUpdateEmail = this.formBuilder.group({
    pacienteId: [0, [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    confirmEmail: ['', [Validators.required]]
  }, { validators: matchEmailsValidator });

  constructor() {
    this.obterDadosPaciente();
    this.obterListaConveniosMedicos();

  }


  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  loadDataIsReady() {
    return !this.isNullOrUndefined(this.paciente);
  }
  isNullOrEmpty(value: any): boolean {
    return AppUtils.isNullOrEmpty(value);
  }
  isNullOrUndefined(value: any): boolean {
    return AppUtils.isNullOrUndefined(value);
  }

  obterDadosPaciente() {
    const userLoggedInfo = this.authService.getUserInfo();
    const pacienteId = userLoggedInfo.id;

    this.pacienteService.getPacienteById(pacienteId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.paciente = response!;
          this.formAddConvenioMedico.controls.pacienteId.setValue(this.paciente.id);
          this.formUpdateEmail.controls.pacienteId.setValue(this.paciente.id);
        },
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      });
  }

  obterListaConveniosMedicos() {
    this.convenioMedicoService.getConveniosMedicos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.conveniosMedicos = AppUtils.orderByAscending(response!, 'nome');
        },
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      });
  }

  abrirModal(modalId: string, dados?: any) {
    if (dados) {
      this.dadosModal = dados; // Armazena os dados
    }

    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);
      this.modalInstance.show();
      this.isModalFechado = false;
    }
  }

  fecharModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement && this.modalInstance) {
      this.dadosModal = null;
      this.modalInstance.hide();
      this.isModalFechado = true;
      document.body.focus();
      this.modalInstance = null; // Reseta a instância do modal
    }
  }


  onclick_ShowModalAlterarSenha() {

  }
  onclick_AlterarSenha() {

  }

  onclick_ShowModalAlterarEmail() {
    this.abrirModal('modalUpdateEmail');
  }
  onclick_AlterarEmail(formDirective: FormGroupDirective) {
    console.log(this.formUpdateEmail.controls)
    console.log(this.formUpdateEmail.value.pacienteId)
    console.log(this.formUpdateEmail.value.email)
    if (this.formUpdateEmail.valid) {

      const userLogged = this.authService.getUserInfo();

      const request = {
        nomeCompleto: this.paciente.nome,
        telefone: this.paciente.telefone,
        email: this.formUpdateEmail.value.email,
        username: userLogged.username
      } as UpdateAuthenticatedUserInfoRequest;

      this.accountService.updateUserLoggedInfo(request)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.fecharModal('modalUpdateEmail');
            this.notificationService.showSuccessNotification('Alteração', 'E-mail alterado com sucesso');
            this.obterDadosPaciente();
            this.authService.logout();
            this.router.navigate(['/login']);
          },
          error: err => this.notificationService.showHttpResponseErrorNotification(err)
        });
    }
  }

  onclick_ShowModalAlterarDadosPaciente() {
    this.formUpdatePaciente.controls.pacienteId.setValue(this.paciente.id);
    this.formUpdatePaciente.controls.nomeCompleto.setValue(this.paciente.nome);
    this.formUpdatePaciente.controls.email.setValue(this.paciente.email);
    this.formUpdatePaciente.controls.telefone.setValue(this.paciente.telefone);
    this.formUpdatePaciente.controls.genero.setValue(this.paciente.genero);
    this.formUpdatePaciente.controls.dataNascimento.setValue(AppUtils.convertDateToLocaleDate(this.paciente.dataNascimento));
    this.abrirModal('modalUpdatePaciente');
  }
  onclick_AlterarDadosPaciente(formDirective: FormGroupDirective) {
    if (this.formUpdatePaciente.valid) {
      const request = this.formUpdatePaciente.value as UpdatePacienteRequest;
      request.dataNascimento = AppUtils.convertToDateFormat(request.dataNascimento.replace('/','').replace('/',''));

      this.pacienteService.updatePacienteById(request.pacienteId, request)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.fecharModal('modalUpdatePaciente');
            this.notificationService.showSuccessNotification('Alteração', 'Dados alterado com sucesso');
            this.obterDadosPaciente();
          },
          error: err => this.notificationService.showHttpResponseErrorNotification(err)
        });

    }
  }

  onclick_ShowModalAdicionarConvenioMedico() {
    this.abrirModal('modalAddConvenios')
  }
  onclick_AdicionarConvenioMedico(formDirective: FormGroupDirective) {
    if (this.formAddConvenioMedico.valid) {
      const request = this.formAddConvenioMedico.value as CreatePacientePlanoMedicoRequest;
      this.pacienteService.createPacientePlanoMedico(this.paciente.id, request)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (!AppUtils.isNullOrUndefined(response)) {
              this.paciente.planosMedicos.push(response);
              this.fecharModal('modalAddConvenios');
              this.notificationService.showSuccessNotification('Cadastro', 'Plano medico cadastrado com sucesso');
            }
          },
          error: err => this.notificationService.showHttpResponseErrorNotification(err)
        })
    }
  }

  onclick_ShowModalAlterarConvenioMedico(planoMedicoId: number) {
    const planoMedico = this.paciente.planosMedicos.find(c => c.id == planoMedicoId)

    this.formUpdateConvenioMedico.controls.pacienteId.setValue(this.paciente.id);
    this.formUpdateConvenioMedico.controls.planoMedicoId.setValue(planoMedico!.id);
    this.formUpdateConvenioMedico.controls.nomePlano.setValue(planoMedico!.nomePlano);
    this.formUpdateConvenioMedico.controls.numeroCarteirinha.setValue(planoMedico!.numCartao);

    this.abrirModal('modalUpdateConvenios');
  }
  onclick_AlterarConvenioMedico(formDirective: FormGroupDirective) {
    if (this.formUpdateConvenioMedico.valid) {
      const request = this.formUpdateConvenioMedico.value as UpdatePacientePlanoMedicoRequest;
      this.pacienteService.updatePacientePlanoMedico(this.paciente.id, request)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (!AppUtils.isNullOrUndefined(response) && response) {
              this.atualizarItemNaListaById(this.paciente.planosMedicos, request.planoMedicoId, {
                nomePlano: request.nomePlano,
                numCartao: request.numeroCarteirinha
              });
              this.fecharModal('modalUpdateConvenios');
              this.notificationService.showSuccessNotification('Alteração', 'Plano medico alterado com sucesso');
            }
          },
          error: err => this.notificationService.showHttpResponseErrorNotification(err)
        })
    }
  }
  atualizarItemNaListaById(lista: any[], id: number, novosDados: Partial<any>) {
    const item = lista.find(c => c.id === id);
    if (item) {
      Object.assign(item, novosDados);
    }
  }

  onclick_ShowModalRemoverConvenioMedico(pacienteId: number, planoMedicoId: number) {
    this.pacienteId = pacienteId;
    this.planoMedicoId = planoMedicoId;

    this.abrirModal('modalDeleteConvenios');
  }
  onclick_RemoverConvenioMedico(pacienteId: number, planoMedicoId: number) {
    const request = new DeletePacientePlanoMedicoRequest();
    request.pacienteId = pacienteId;
    request.planoMedicoId = planoMedicoId;

    this.pacienteService.deletePacientePlanoMedico(this.paciente.id, request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (!AppUtils.isNullOrUndefined(response) && response) {
            this.removerItemNaListaById(this.paciente.planosMedicos, planoMedicoId);
            this.fecharModal('modalDeleteConvenios');
            this.notificationService.showSuccessNotification('Deletar', 'Plano medico removido com sucesso');
          }
        },
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      })
  }
  removerItemNaListaById(lista: any[], removeId: number) {
    const index = lista.findIndex(item => item.id === removeId);
    if (index !== -1) {
      lista.splice(index, 1);
    }
  }
}
