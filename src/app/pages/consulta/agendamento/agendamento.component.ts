import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { EspecialidadeService } from 'src/app/core/services/especialidade.service';
import { CommonService } from 'src/app/core/services/common.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
declare var $: any;
@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './agendamento.component.html',
  styleUrl: './agendamento.component.css'
})
export class AgendamentoConsultaComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private especialidadeService = inject(EspecialidadeService);
  private commonService = inject(CommonService);

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();// Limpeza de memória
  }

}
