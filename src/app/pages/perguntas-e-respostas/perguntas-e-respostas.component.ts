import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PerguntaResponse } from 'src/app/core/models/perguntas-respostas/response/PerguntaResponse';
import { PerguntasRespostasService } from 'src/app/core/services/perguntas-respostas.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-perguntas-e-respostas',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule
  ],
  templateUrl: './perguntas-e-respostas.component.html',
  styleUrl: './perguntas-e-respostas.component.css'
})
export class PerguntasERespostasComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private perguntaRespostaService = inject(PerguntasRespostasService);

  perguntasList: PerguntaResponse[] = [];

  constructor() { }

  ngOnInit(): void {
    this.getPerguntasList();
  }


  getPerguntasList(page: number = 1, pageSize: number = 20) {
    this.perguntaRespostaService.getPerguntasPaged(page, pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.perguntasList = response.data!.results;
        },
        error: (err) => {
          this.notificationService.showHttpResponseErrorNotification(err);
        }
      });
  }

  onRedirectPergunta(id: number) {
    console.log('vai redirecionar para a pergunta com id: ', id);
    //this.router.navigate(['/perguntas-e-respostas', id]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
