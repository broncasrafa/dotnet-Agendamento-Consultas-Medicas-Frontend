import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { AppUtils } from 'src/app/core/utils/app.util';
import { DateExtensoFormattedPipe } from 'src/app/shared/pipes/date-extenso-formatted.pipe';
import { AddressFormattedPipe } from 'src/app/shared/pipes/address-formatted.pipe';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { CryptoService } from 'src/app/shared/services/crypto.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AgendamentoService } from 'src/app/core/services/agendamento.service';
import { AgendamentoResponse } from 'src/app/core/models/agendamento/response/AgendamentoResponse';

@Component({
  selector: 'app-consultas-paciente-detalhes',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DateExtensoFormattedPipe,
    AddressFormattedPipe,
  ],
  templateUrl: './consultas-paciente-detalhes.component.html',
  styleUrl: './consultas-paciente-detalhes.component.css'
})
export class ConsultasPacienteDetalhesComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);
  private agendamentoService = inject(AgendamentoService);
  private cryptoService = inject(CryptoService);
  private loadingService = inject(LoadingService);

  agendamentoId: number;
  agendamento: AgendamentoResponse;

  constructor() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['agendamentoId']) {
        this.agendamentoId = this.cryptoService.descriptografar(params['agendamentoId']);
        this.obterDadosAgendamento();
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();// Limpeza de memória
  }

  loadDataIsReady() {
    return !this.isNullOrUndefined(this.agendamento);
  }

  isNullOrEmpty(value: any): boolean {
    return AppUtils.isNullOrEmpty(value);
  }
  isNullOrUndefined(value: any): boolean {
    return AppUtils.isNullOrUndefined(value);
  }

  obterDadosAgendamento() {
    this.agendamentoService.getAgendamentoById(this.agendamentoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.agendamento = response;
        },
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
    });
  }

  onclick_VoltarHistorico() {
    this.router.navigate(['/paciente/consultas']);
  }
}
