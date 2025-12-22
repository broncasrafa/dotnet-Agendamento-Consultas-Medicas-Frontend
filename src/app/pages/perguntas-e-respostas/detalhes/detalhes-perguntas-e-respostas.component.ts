import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { PerguntaResponse } from 'src/app/core/models/perguntas-respostas/response/PerguntaResponse';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { PerguntasRespostasService } from 'src/app/core/services/perguntas-respostas.service';
import { CryptoService } from 'src/app/shared/services/crypto.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { BsModalService } from 'src/app/shared/services/bs-modal.service';
import { CreateReacaoRespostaRequest } from 'src/app/core/models/perguntas-respostas/request/CreateReacaoRespostaRequest';
import { RespostaResponse } from 'src/app/core/models/perguntas-respostas/response/RespostaResponse';
import { AppUtils } from 'src/app/core/utils/app.util';

@Component({
  selector: 'app-detalhes-perguntas-e-respostas',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink
  ],
  templateUrl: './detalhes-perguntas-e-respostas.component.html',
  styleUrl: './detalhes-perguntas-e-respostas.component.css'
})
export class PerguntasERespostasDetalhesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private router = inject(Router);
  private authService = inject(AuthenticationService);
  private activatedRoute = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);
  private perguntaRespostaService = inject(PerguntasRespostasService);
  private cryptoService = inject(CryptoService);
  private modalService = inject(BsModalService);

  perguntaId: number;
  pergunta: PerguntaResponse;
  mostrarModalFazerLogin: boolean = false;
  isLogged: boolean = this.authService.isLoggedIn();
  userInfo = this.authService.getUserInfo();

  constructor() {
    const paramId = this.activatedRoute.snapshot.paramMap.get('id')!;
    const id = this.cryptoService.descriptografar(paramId);
    this.perguntaId = Number(id);
    this.getPerguntaDetalhes();
  }

  ngOnInit(): void {
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
        },
        error: (error) => this.notificationService.showHttpResponseErrorNotification(error)
      });
  }

  onclick_redirect_login() {
    this.modalService.fecharModal('modalFazerLogin');
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
  }
  onclick_redirect_register() {
    this.modalService.fecharModal('modalFazerLogin');
    this.router.navigate(['/paciente/registrar'], { queryParams: { returnUrl: this.router.url } });
  }

  onToggleLike(resposta: RespostaResponse): void {
    // Se não estiver logado, manda para login e volta depois
    // if (!this.isLogged) {
    //   this.router.navigate(['/login'], {
    //     queryParams: { returnUrl: this.router.url }
    //   });
    //   return;
    // }
    if (!this.isLogged) {
      this.modalService.abrirModal('modalFazerLogin');
      return;
    }

    // Guarda estado anterior para poder fazer rollback em caso de erro
    const wasLiked = !!resposta.likedByCurrentUser;
    const previousCount = resposta.likesCount ?? 0;

    // Chama a API para registrar a reação (curtir / descurtir)
    const request = {
      respostaId: resposta.id,
      pacienteId: this.authService.getUserInfo().id
    } as CreateReacaoRespostaRequest;

    if (resposta.likedByCurrentUser) {
      this.perguntaRespostaService.dislikeResposta(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.data!) {
            resposta.likedByCurrentUser = false;
            resposta.likesCount = Math.max(previousCount - 1, 0);
          }
        },
        error: (error) => {
          resposta.likedByCurrentUser = wasLiked;
          resposta.likesCount = previousCount;
          this.notificationService.showHttpResponseErrorNotification(error)
        }
      });

    } else {
      this.perguntaRespostaService.likeResposta(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.data!) {
            resposta.likedByCurrentUser = true;
            resposta.likesCount = previousCount + 1;
          }
        },
        error: (error) => {
          resposta.likedByCurrentUser = wasLiked;
          resposta.likesCount = previousCount;
          this.notificationService.showHttpResponseErrorNotification(error)
        }
      });
    }
  }
}
