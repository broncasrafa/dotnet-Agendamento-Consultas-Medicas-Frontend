import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Modal } from 'bootstrap';
import { AppUtils } from 'src/app/core/utils/app.util';
import { StringExtensions } from 'src/app/core/extensions/string.extensions';
import { IsNullOrUndefinedPipe } from 'src/app/shared/pipes/is-null-or-undefined.pipe';
import { EspecialistaResponse } from 'src/app/core/models/especialista/response/EspecialistaResponse';
import { EspecialidadeResponse } from 'src/app/core/models/especialidade/response/EspecialidadeResponse';
import { ConvenioMedicoResponse } from 'src/app/core/models/convenio-medico/response/ConvenioMedicoResponse';
import { EspecialistaService } from 'src/app/core/services/especialista.service';
import { EspecialidadeService } from 'src/app/core/services/especialidade.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CryptoService } from 'src/app/shared/services/crypto.service';
import { RatingStarsComponent } from 'src/app/shared/components/rating-stars/rating-stars.component';
import { FormFazerPerguntaComponent } from 'src/app/pages/perguntas-e-respostas/form-fazer-pergunta/form-fazer-pergunta.component';
import { HorariosAgendamento, ListarHorariosDisponiveisComponent } from 'src/app/pages/especialista/listar-horarios-disponiveis/listar-horarios-disponiveis.component';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { BsModalService } from 'src/app/shared/services/bs-modal.service';
import { PerguntasRespostasService } from 'src/app/core/services/perguntas-respostas.service';
import { CreatePerguntaRequest } from 'src/app/core/models/perguntas-respostas/request/CreatePerguntaRequest';
import { PerguntaResponse } from 'src/app/core/models/perguntas-respostas/response/PerguntaResponse';
import { NumberThousandsFormattedPipe } from 'src/app/shared/pipes/number-thousands-formatted.pipe';


@Component({
  selector: 'app-detalhes-especialista',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    RatingStarsComponent,
    ListarHorariosDisponiveisComponent,
    FormFazerPerguntaComponent,
    NumberThousandsFormattedPipe
  ],
  templateUrl: './detalhes-especialista.component.html',
  styleUrl: './detalhes-especialista.component.css'
})
export class DetalhesEspecialistaComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthenticationService);
  private notificationService = inject(NotificationService);
  private cryptoService = inject(CryptoService);
  private loadingService = inject(LoadingService);
  private especialistaService = inject(EspecialistaService);
  private especialidadeService = inject(EspecialidadeService);
  private perguntaRespostaService = inject(PerguntasRespostasService);
  private modalService = inject(BsModalService);

  especialistaId: number;
  especialidadeId: number;
  especialista: EspecialistaResponse;
  perguntas: PerguntaResponse[] = [];

  paginaAtual = 1; // Página inicial
  carregando = false; // Flag para controlar requisição
  temMaisItens = true;

  constructor() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.especialistaId = this.cryptoService.descriptografar(id!)
    this.obterDadosEspecialista();
    this.obterListaPerguntasEspecialista();
  }
  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDataInfo() {
    return !AppUtils.isNullOrUndefined(this.especialista);
  }
  isNullOrUndefined(value: any): boolean {
    return AppUtils.isNullOrUndefined(value);
  }
  isNullOrEmpty(value: any): boolean {
    return AppUtils.isNullOrEmpty(value);
  }

  obterDadosEspecialista() {
    this.especialistaService.getEspecialistaById(this.especialistaId)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.especialista = response!;
        this.especialidadeId = this.especialista.especialidades[0].id;
        console.log('[ESPECIALISTA]: ', this.especialista)
      },
      error: (error) => this.notificationService.showHttpResponseErrorNotification(error)
    });
  }


  onclick_ShowFormPergunta() {
    if (this.authService.isLoggedIn()) {
      this.especialidadeId = this.especialista.especialidades[0].id;
      this.modalService.abrirModal('modalFazerPergunta');
    }
  }
  getPerguntaRequestDataEmitted(request: CreatePerguntaRequest) {
    if (!this.isNullOrUndefined(request)) {
      request.especialistaId = Number(this.especialistaId);
      request.especialidadeId = Number(this.especialidadeId);

      this.perguntaRespostaService.createPerguntaEspecialista(request)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.modalService.fecharModal('modalFazerPergunta');
            this.notificationService.showSuccessNotification('Pergunta', 'Pergunta enviada com sucesso');
          },
          error: (err) => this.notificationService.showHttpResponseErrorNotification(err)
        });


      // obter a lista de perguntas feitas para esse especialista

    }
  }

  obterListaPerguntasEspecialista() {
    this.perguntaRespostaService.getPerguntasEspecialistasPaged(this.especialistaId, this.paginaAtual)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (!AppUtils.isNullOrUndefined(response) && response.data.results.length > 0) {
            this.perguntas = response.data.results
            this.paginaAtual++;
            this.temMaisItens = response.data.hasNextPage;
          } else {
            this.temMaisItens = false;
          }
        },
        error: (error) => this.notificationService.showHttpResponseErrorNotification(error)
      });
  }
  obterMaisPerguntasEspecialista() {
    if (this.carregando || !this.temMaisItens)
      return;

    this.carregando = true;

    this.perguntaRespostaService.getPerguntasEspecialistasPaged(this.especialistaId, this.paginaAtual)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (!AppUtils.isNullOrUndefined(response) && response.data.results.length > 0) {
            this.perguntas = [...this.perguntas, ...response.data.results];
            this.paginaAtual++;
            this.temMaisItens = response.data.hasNextPage;
            this.carregando = false;
          } else {
            this.carregando = false;
            this.temMaisItens = false;
          }
        },
        error: (error) => this.notificationService.showHttpResponseErrorNotification(error)
      });
  }
}
