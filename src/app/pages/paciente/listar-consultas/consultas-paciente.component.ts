import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { CryptoService } from 'src/app/shared/services/crypto.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { AgendamentoResponse } from 'src/app/core/models/agendamento/response/AgendamentoResponse';
import { AppUtils } from 'src/app/core/utils/app.util';
import { DateExtensoFormattedPipe } from 'src/app/shared/pipes/date-extenso-formatted.pipe';
import { AddressFormattedPipe } from 'src/app/shared/pipes/address-formatted.pipe';

@Component({
  selector: 'app-consultas-paciente',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DateExtensoFormattedPipe,
    AddressFormattedPipe,
  ],
  templateUrl: './consultas-paciente.component.html',
  styleUrl: './consultas-paciente.component.css'
})
export class ConsultasPacienteComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private authService = inject(AuthenticationService);
    private notificationService = inject(NotificationService);
    private pacienteService = inject(PacienteService);
    private cryptoService = inject(CryptoService);
    private loadingService = inject(LoadingService);

    pacienteId: number;
    agendamentos: AgendamentoResponse[] = [];

  constructor() {
    this.obterHistoricoAgendamentosPaciente();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();// Limpeza de memória
  }

  loadDataIsReady() {
    return !this.isNullOrUndefined(this.agendamentos);
  }

  isNullOrEmpty(value: any): boolean {
    return AppUtils.isNullOrEmpty(value);
  }
  isNullOrUndefined(value: any): boolean {
    return AppUtils.isNullOrUndefined(value);
  }


  obterHistoricoAgendamentosPaciente() {
    const userLoggedInfo = this.authService.getUserInfo();
    const pacienteId = userLoggedInfo.id;
    this.pacienteId = pacienteId!;

    this.pacienteService.getHistoricoAgendamentosPaciente(pacienteId!)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) =>  {
        this.agendamentos = AppUtils.orderByDescending(response!, 'id');
      },
      error: err => this.notificationService.showHttpResponseErrorNotification(err)
    })
  }

  onclick_DetalhesAgendamento(agendamentoId: number) {
    const pacienteId = this.cryptoService.criptografar(this.pacienteId);
    const id = this.cryptoService.criptografar(agendamentoId);
    this.router.navigate(['/paciente/consultas/' + pacienteId], {
      queryParams: {
        agendamentoId: id
      }
    });
  }
}
