import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { PerguntaResponse } from 'src/app/core/models/perguntas-respostas/response/PerguntaResponse';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { PerguntasRespostasService } from 'src/app/core/services/perguntas-respostas.service';

@Component({
  selector: 'app-detalhes-perguntas-e-respostas',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './detalhes-perguntas-e-respostas.component.html',
  styleUrl: './detalhes-perguntas-e-respostas.component.css'
})
export class PerguntasERespostasDetalhesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private route = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);
  private perguntaRespostaService = inject(PerguntasRespostasService);

  perguntaId: number;
  pergunta: PerguntaResponse;

  constructor() {
    this.perguntaId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getPerguntaDetalhes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getPerguntaDetalhes() {
    this.perguntaRespostaService.getPerguntaById(this.perguntaId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.pergunta = response.data!;
          console.log(this.pergunta);
        },
        error: (error) => this.notificationService.showHttpResponseErrorNotification(error)
      });
  }
}
