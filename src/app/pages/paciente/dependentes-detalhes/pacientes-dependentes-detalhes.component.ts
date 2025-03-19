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
import { LoadingService } from 'src/app/shared/services/loading.service';
import { CryptoService } from 'src/app/shared/services/crypto.service';
import { BsModalService } from 'src/app/shared/services/bs-modal.service';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { ConvenioMedicoService } from 'src/app/core/services/convenio-medico.service';
import { PacienteResponse } from 'src/app/core/models/paciente/response/PacienteResponse';
import { ConvenioMedicoResponse } from 'src/app/core/models/convenio-medico/response/ConvenioMedicoResponse';
import { PacienteDependenteResponse } from 'src/app/core/models/paciente/response/PacienteDependenteResponse';
import { CreatePacientePlanoMedicoRequest } from 'src/app/core/models/paciente/request/CreatePacientePlanoMedicoRequest';
import { UpdatePacientePlanoMedicoRequest } from 'src/app/core/models/paciente/request/UpdatePacientePlanoMedicoRequest';
import { DeletePacientePlanoMedicoRequest } from 'src/app/core/models/paciente/request/DeletePacientePlanoMedicoRequest';
import { UpdatePacienteRequest } from 'src/app/core/models/paciente/request/UpdatePacienteRequest';
import { ChangePasswordRequest } from 'src/app/core/models/account/request/ChangePasswordRequest';
import { AppUtils } from 'src/app/core/utils/app.util';
import { CpfFormattedPipe } from 'src/app/shared/pipes/cpf-formatted.pipe';
import { DateFormattedPipe } from 'src/app/shared/pipes/date-formatted.pipe';
import { TelefoneFormattedPipe } from 'src/app/shared/pipes/telefone-formatted.pipe';
import { DisplayValidationErrorsComponent } from 'src/app/shared/components/display-validation-errors/display-validation-errors.component';
import { UpdateAuthenticatedUserInfoRequest } from 'src/app/core/models/account/request/UpdateAuthenticatedUserInfoRequest';

import {
  dateOfBirthFormatValidator,
  fullNameValidator,
  matchEmailsValidator,
  matchPasswordsValidator,
  passwordComplexityValidator,
  phoneNumberValidator,
  cpfValidator } from 'src/app/core/utils/form-validators.util';
import { PacienteDependenteService } from 'src/app/core/services/paciente-dependente.service';
import { UpdatePacienteDependenteRequest } from 'src/app/core/models/paciente/request/UpdatePacienteDependenteRequest';
import { DeletePacienteDependentePlanoMedicoRequest } from 'src/app/core/models/paciente/request/DeletePacienteDependentePlanoMedicoRequest';
import { CreatePacienteDependentePlanoMedicoRequest } from 'src/app/core/models/paciente/request/CreatePacienteDependentePlanoMedicoRequest';
import { UpdatePacienteDependentePlanoMedicoRequest } from 'src/app/core/models/paciente/request/UpdatePacienteDependentePlanoMedicoRequest';


@Component({
  selector: 'app-pacientes-dependentes-detalhes',
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
  templateUrl: './pacientes-dependentes-detalhes.component.html',
  styleUrl: './pacientes-dependentes-detalhes.component.css'
})
export class PacientesDependentesDetalhesComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthenticationService);
  private accountService = inject(AccountService);
  private notificationService = inject(NotificationService);
  private pacienteDependenteService = inject(PacienteDependenteService);
  private convenioMedicoService = inject(ConvenioMedicoService);
  private cryptoService = inject(CryptoService);
  private loadingService = inject(LoadingService);
  private modalService = inject(BsModalService);

  dependenteId: number;
  pacientePrincipalId: number;
  planoMedicoId: number;
  dependente: PacienteDependenteResponse;
  conveniosMedicos: ConvenioMedicoResponse[] = [];
  isModalFechado = false;

  formUpdateDadosDependente = this.formBuilder.group({
    dependenteId: [0, [Validators.required]],
    pacientePrincipalId: [0, [Validators.required]],
    nomeCompleto: ['', [Validators.required, fullNameValidator]],
    email: ['', [Validators.required]],
    genero: ['', [Validators.required]],
    dataNascimento: ['', [Validators.required, dateOfBirthFormatValidator(false)]],
    cpf: ['', [Validators.required, cpfValidator]],
    telefone: ['', [Validators.required, phoneNumberValidator]],
  });

  formAddConvenioMedico = this.formBuilder.group({
    dependenteId: [0, [Validators.required]],
    pacientePrincipalId: [0, [Validators.required]],
    convenioMedicoId: [0, [Validators.required]],
    nomePlano: ['', [Validators.required]],
    numCartao: ['', [Validators.required]],
  });

  formUpdateConvenioMedico = this.formBuilder.group({
    dependenteId: [0, [Validators.required]],
    pacientePrincipalId: [0, [Validators.required]],
    planoMedicoId: [0, [Validators.required]],
    convenioMedicoId: [0, [Validators.required]],
    nomePlano: ['', [Validators.required]],
    numeroCarteirinha: ['', [Validators.required]],
  });

  constructor() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.dependenteId = this.cryptoService.descriptografar(id!);
    this.obterDadosDependente();
    this.obterListaConveniosMedicos();

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['pacientePrincipalId']) {
        this.pacientePrincipalId = this.cryptoService.descriptografar(params['pacientePrincipalId']);
      }
    });
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDataIsReady() {
    return !this.isNullOrUndefined(this.dependente);
  }
  isNullOrEmpty(value: any): boolean {
    return AppUtils.isNullOrEmpty(value);
  }
  isNullOrUndefined(value: any): boolean {
    return AppUtils.isNullOrUndefined(value);
  }

  obterDadosDependente() {
    console.log()
    this.pacienteDependenteService.getPacienteDependenteById(this.dependenteId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.dependente = response!;
          this.setDadosFormUpdateDadosDependente(this.dependente);

          // this.formUpdateEmail.controls.pacienteId.setValue(this.paciente.id);
          // this.formUpdateSenha.controls.pacienteId.setValue(this.paciente.id);
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

  setDadosFormUpdateDadosDependente(dependente: PacienteDependenteResponse) {
    this.formUpdateDadosDependente.controls.pacientePrincipalId.setValue(this.pacientePrincipalId);
    this.formUpdateDadosDependente.controls.dependenteId.setValue(dependente.id);
    this.formUpdateDadosDependente.controls.cpf.setValue(dependente.cpf);
    this.formUpdateDadosDependente.controls.email.setValue(dependente.email);
    this.formUpdateDadosDependente.controls.nomeCompleto.setValue(dependente.nome);
    this.formUpdateDadosDependente.controls.telefone.setValue(dependente.telefone);
    this.formUpdateDadosDependente.controls.genero.setValue(dependente.genero);
    this.formUpdateDadosDependente.controls.dataNascimento.setValue(dependente.dataNascimento);
    this.formUpdateDadosDependente.patchValue({
      dataNascimento: AppUtils.convertDateToLocaleDate(dependente.dataNascimento)
    });
  }
  onclick_ShowModalAlterarDadosPacienteDepedente() {
    this.modalService.abrirModal('modalUpdateDependente')
  }
  onclick_AtualizarDadosDependente(formDirective: FormGroupDirective) {
    if (this.formUpdateDadosDependente.valid) {
      const request = this.formUpdateDadosDependente.value as UpdatePacienteDependenteRequest;
      request.dataNascimento = AppUtils.convertToDateFormat(request.dataNascimento.replace('/','').replace('/',''));

      this.pacienteDependenteService.updatePacienteDependente(request)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.modalService.fecharModal('modalUpdateDependente');
            this.notificationService.showSuccessNotification('Alteração', 'Dados alterado com sucesso');
            this.obterDadosDependente();
          },
          error: err => this.notificationService.showHttpResponseErrorNotification(err)
        });
    }
  }

  onclick_ShowModalAdicionarConvenioMedico() {
    this.formAddConvenioMedico.controls.pacientePrincipalId.setValue(this.pacientePrincipalId);
    this.formAddConvenioMedico.controls.dependenteId.setValue(this.dependente.id);

    this.modalService.abrirModal('modalAddConvenios');
  }
  onclick_AdicionarConvenioMedico(formDirective: FormGroupDirective) {
    if (this.formAddConvenioMedico.valid) {
      const request = this.formAddConvenioMedico.value as CreatePacienteDependentePlanoMedicoRequest;
      this.pacienteDependenteService.createPacienteDependentePlanoMedico(this.dependente.id, request)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (!AppUtils.isNullOrUndefined(response)) {
              this.obterDadosDependente();
              this.modalService.fecharModal('modalAddConvenios');
              this.notificationService.showSuccessNotification('Cadastro', 'Plano medico cadastrado com sucesso');
            }
          },
          error: err => this.notificationService.showHttpResponseErrorNotification(err)
        })
    }
  }

  onclick_ShowModalAlterarConvenioMedico(planoMedicoId: number) {
    const planoMedico = this.dependente.planosMedicos.find(c => c.id == planoMedicoId);

    this.formUpdateConvenioMedico.controls.dependenteId.setValue(this.dependente.id);
    this.formUpdateConvenioMedico.controls.pacientePrincipalId.setValue(this.pacientePrincipalId);
    this.formUpdateConvenioMedico.controls.planoMedicoId.setValue(planoMedico!.id);
    this.formUpdateConvenioMedico.controls.convenioMedicoId.setValue(planoMedico!.convenioMedicoId!);
    this.formUpdateConvenioMedico.controls.nomePlano.setValue(planoMedico!.nomePlano);
    this.formUpdateConvenioMedico.controls.numeroCarteirinha.setValue(planoMedico!.numCartao);

    this.modalService.abrirModal('modalUpdateConvenios')
  }
  onclick_AlterarConvenioMedico(formDirective: FormGroupDirective) {
    if (this.formUpdateConvenioMedico.valid) {
      const request = this.formUpdateConvenioMedico.value as UpdatePacienteDependentePlanoMedicoRequest;
      this.pacienteDependenteService.updatePacienteDependentePlanoMedico(this.dependente.id, request)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (!AppUtils.isNullOrUndefined(response) && response) {
              const nomeConvenio = this.conveniosMedicos.find(c => c.id == request.convenioMedicoId);

              AppUtils.atualizarItemNaListaById(this.dependente.planosMedicos, request.planoMedicoId, {
                nomePlano: request.nomePlano,
                numCartao: request.numeroCarteirinha,
                convenioMedico: nomeConvenio?.nome,
                convenioMedicoId: request.convenioMedicoId
              });
              this.modalService.fecharModal('modalUpdateConvenios');
              this.notificationService.showSuccessNotification('Alteração', 'Plano medico alterado com sucesso');
            }
          },
          error: err => this.notificationService.showHttpResponseErrorNotification(err)
        })
    }
  }


  onclick_ShowModalRemoverConvenioMedico(dependenteId: number, planoMedicoId: number) {
    this.dependenteId = dependenteId;
    this.planoMedicoId = planoMedicoId;

    this.modalService.abrirModal('modalDeleteConvenios');
  }
  onclick_RemoverConvenioMedico(dependenteId: number, planoMedicoId: number) {
    const request = {
      dependenteId: dependenteId,
      pacientePrincipalId: this.pacientePrincipalId,
      planoMedicoId: planoMedicoId
    } as DeletePacienteDependentePlanoMedicoRequest;

    this.pacienteDependenteService.deletePacienteDependentePlanoMedico(dependenteId, request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (!AppUtils.isNullOrUndefined(response) && response) {
            AppUtils.removerItemNaListaById(this.dependente.planosMedicos, planoMedicoId);
            this.modalService.fecharModal('modalDeleteConvenios');
            this.notificationService.showSuccessNotification('Deletar', 'Plano medico removido com sucesso');
          }
        },
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      })
  }
}
