import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { CryptoService } from 'src/app/shared/services/crypto.service';
import { AgendamentoResponse } from 'src/app/core/models/agendamento/response/AgendamentoResponse';
import { AppUtils } from 'src/app/core/utils/app.util';

@Component({
  selector: 'app-consultas-paciente',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
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

    pacienteId: number;
    agendamentos: AgendamentoResponse[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.obterHistoricoAgendamentosPaciente();
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
        console.log(this.agendamentos)
      },
      error: err => this.notificationService.showHttpResponseErrorNotification(err)
    })
  }

  onclick_DetalhesAgendamento(agendamentoId: number) {
    const id = this.cryptoService.criptografar(agendamentoId);
    this.router.navigate(['/paciente/consultas/' + this.pacienteId], {
      queryParams: {
        agendamentoId: id
      }
    });
  }
}
