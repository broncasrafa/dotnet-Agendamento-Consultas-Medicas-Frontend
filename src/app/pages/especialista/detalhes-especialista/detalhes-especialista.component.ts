import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AppUtils } from 'src/app/core/utils/app.util';
import { IsNullOrUndefinedPipe } from 'src/app/shared/pipes/is-null-or-undefined.pipe';
import { EspecialistaResponse } from 'src/app/core/models/especialista/response/EspecialistaResponse';
import { EspecialistaService } from 'src/app/core/services/especialista.service';
import { EspecialidadeService } from 'src/app/core/services/especialidade.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CryptoService } from 'src/app/shared/services/crypto.service';
import { RatingStarsComponent } from 'src/app/shared/components/rating-stars/rating-stars.component';
import { FormFazerPerguntaComponent } from 'src/app/pages/perguntas-e-respostas/form-fazer-pergunta/form-fazer-pergunta.component';
import { ListarHorariosDisponiveisComponent } from 'src/app/pages/especialista/listar-horarios-disponiveis/listar-horarios-disponiveis.component';
import { SigninAndSignupSuggestionComponent } from 'src/app/shared/components/signin-and-signup-suggestion/signin-and-signup-suggestion.component';
import { GenericSimpleModalComponent, ModalSize } from 'src/app/shared/components/generic-simple-modal/generic-simple-modal.component';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { BsModalService } from 'src/app/shared/services/bs-modal.service';
import { PerguntasRespostasService } from 'src/app/core/services/perguntas-respostas.service';
import { CreatePerguntaRequest } from 'src/app/core/models/perguntas-respostas/request/CreatePerguntaRequest';
import { PerguntaResponse } from 'src/app/core/models/perguntas-respostas/response/PerguntaResponse';
import { NumberThousandsFormattedPipe } from 'src/app/shared/pipes/number-thousands-formatted.pipe';
import { EspecialistaAvaliacaoResponse } from 'src/app/core/models/especialista/response/EspecialistaAvaliacaoResponse';
import { DateExtensoFormattedPipe } from 'src/app/shared/pipes/date-extenso-formatted.pipe';
import { OrderByLoopCollectionPipe } from 'src/app/shared/pipes/order-by-loop-collection.pipe';

@Component({
  selector: 'app-detalhes-especialista',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    RatingStarsComponent,
    ListarHorariosDisponiveisComponent,
    FormFazerPerguntaComponent,
    GenericSimpleModalComponent,
    SigninAndSignupSuggestionComponent,
    NumberThousandsFormattedPipe,
    IsNullOrUndefinedPipe,
    DateExtensoFormattedPipe,
    OrderByLoopCollectionPipe
  ],
  templateUrl: './detalhes-especialista.component.html',
  styleUrl: './detalhes-especialista.component.css'
})
export class DetalhesEspecialistaComponent implements OnInit, OnDestroy {
  @ViewChild('modalFazerLogin')
  modalFazerLoginComponent?: SigninAndSignupSuggestionComponent;

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

  avaliacoesAgrupadas: any[];

  readonly ModalSize = ModalSize;

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
  isArrayNullOrEmpty(value: any[]): boolean {
    return AppUtils.isArrayNullOrEmpty<any>(value);
  }
  take(lista: any[], count: number) {
      return AppUtils.take(lista, count);
    }

  obterDadosEspecialista() {
    this.especialistaService.getEspecialistaById(this.especialistaId)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.especialista = response!;
        this.especialidadeId = this.especialista.especialidades[0].id;

        if (!this.isArrayNullOrEmpty(response!.avaliacoes)) {
          this.avaliacoesAgrupadas = this.groupAvaliacaoMarcacao(response!.avaliacoes);
        }
      },
      error: (error) => this.notificationService.showHttpResponseErrorNotification(error)
    });
  }

  groupAvaliacaoMarcacao(avaliacoes: EspecialistaAvaliacaoResponse[]): { marcacao: string; total: number }[] {
    const map = new Map<string, number>();
    avaliacoes.forEach(a => {
      const count = map.get(a.marcacao) ?? 0;
      map.set(a.marcacao, count + 1);
    });
    return Array.from(map, ([marcacao, total]) => ({ marcacao, total }))
  }


  onclick_showFormPergunta() {
    if (!this.authService.isLoggedIn()) {
      this.modalFazerLoginComponent?.showModal()
      return;
    }

    this.especialidadeId = this.especialista.especialidades[0].id;
    this.modalService.abrirModal('modalFazerPergunta');
  }
  getPerguntaRequestDataEmitted(request: CreatePerguntaRequest) {
    if (!this.isNullOrUndefined(request)) {
      request.especialistaId = Number(this.especialistaId);
      request.especialidadeId = Number(this.especialidadeId);

      this.perguntaRespostaService.createPerguntaEspecialista(request)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.perguntas.push(response)
            this.modalService.fecharModal('modalFazerPergunta');
            this.notificationService.showSuccessNotification('Pergunta', 'Pergunta enviada com sucesso');
          },
          error: (err) => this.notificationService.showHttpResponseErrorNotification(err)
        });
    }
  }

  onclick_redirect_pergunta(id: number) {
    const perguntaId = this.cryptoService.criptografar(id);
    this.router.navigate(['/perguntas-e-respostas', perguntaId]);
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

  /**
   * rolar para uma parte da tela (anchor)
   */
  scrollToAvaliacoes() {
    const tabButton = document.getElementById('avaliacoes-tab');
    tabButton?.click();

    setTimeout(() => {
      document.getElementById('avaliacoes')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 150);
  }
}
