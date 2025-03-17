import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Modal } from 'bootstrap';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { PacienteResponse } from 'src/app/core/models/paciente/response/PacienteResponse';
import { AppUtils } from 'src/app/core/utils/app.util';
import { CpfFormattedPipe } from 'src/app/shared/pipes/cpf-formatted.pipe';
import { DateFormattedPipe } from 'src/app/shared/pipes/date-formatted.pipe';
import { TelefoneFormattedPipe } from 'src/app/shared/pipes/telefone-formatted.pipe';

@Component({
  selector: 'app-dados-conta-paciente',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
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
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthenticationService);
  private notificationService = inject(NotificationService);
  private pacienteService = inject(PacienteService);

  modalInstance?: Modal;
  paciente: PacienteResponse;

  constructor() {
    this.obterDadosPaciente();
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
        },
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      });
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

  }
  onclick_AdicionarConvenioMedico() {

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
