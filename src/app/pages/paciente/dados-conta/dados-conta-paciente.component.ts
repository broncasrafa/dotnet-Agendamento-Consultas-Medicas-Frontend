import { Component, ElementRef, inject, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Modal } from 'bootstrap';
import { NgxMaskDirective } from 'ngx-mask';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
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

import * as bootstrap from 'bootstrap';
import { CreatePacientePlanoMedicoRequest } from 'src/app/core/models/paciente/request/CreatePacientePlanoMedicoRequest';
import { UpdatePacientePlanoMedicoRequest } from 'src/app/core/models/paciente/request/UpdatePacientePlanoMedicoRequest';
import { DeletePacientePlanoMedicoRequest } from 'src/app/core/models/paciente/request/DeletePacientePlanoMedicoRequest';

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
  private notificationService = inject(NotificationService);
  private pacienteService = inject(PacienteService);
  private convenioMedicoService = inject(ConvenioMedicoService);

  modalInstance?: Modal | null;
  paciente: PacienteResponse;
  conveniosMedicos: ConvenioMedicoResponse[] = [];
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
    }
  }

  fecharModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement && this.modalInstance) {
      this.dadosModal = null;
      this.modalInstance.hide();
      this.modalInstance = null; // Reseta a instância do modal
    }
  }


  onclick_ShowModalAlterarSenha() {

  }
  onclick_AlterarSenha() {

  }

  onclick_ShowModalAlterarDadosPaciente() {

  }
  onclick_AlterarDadosPaciente() {

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
