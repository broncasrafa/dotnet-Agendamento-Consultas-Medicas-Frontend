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

  formConvenioMedico = this.formBuilder.group({
    pacienteId: [0, [Validators.required]],
    convenioMedicoId: [0, [Validators.required]],
    nomePlano: ['', [Validators.required]],
    numCartao: ['', [Validators.required]],
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

  setValoresFormInit() {

  }

  obterDadosPaciente() {
    const userLoggedInfo = this.authService.getUserInfo();
    const pacienteId = userLoggedInfo.id;

    this.pacienteService.getPacienteById(pacienteId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.paciente = response!;
          this.formConvenioMedico.controls.pacienteId.setValue(this.paciente.id);
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

  abrirModal(modalId: string){
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  fecharModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement && this.modalInstance) {
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
    if (this.formConvenioMedico.valid) {
      const request = this.formConvenioMedico.value as CreatePacientePlanoMedicoRequest;
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

  onclick_ShowModalAlterarConvenioMedico() {
  }
  onclick_AlterarConvenioMedico() {

  }

  onclick_ShowModalRemoverConvenioMedico() {

  }
  onclick_RemoverConvenioMedico() {

  }
}
