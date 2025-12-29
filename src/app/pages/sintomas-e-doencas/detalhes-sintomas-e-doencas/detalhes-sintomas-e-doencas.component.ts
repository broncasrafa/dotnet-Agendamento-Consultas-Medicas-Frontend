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
import { DadosEspecialistaListaComponent } from 'src/app/pages/especialista/dados-especialista-lista/dados-especialista-lista.component';
import { SintomasDoencasResponse } from 'src/app/core/models/sintomas-e-doencas/response/SintomasDoencasResponse';
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
import { SintomasEDoencasService } from 'src/app/core/services/sintomas-e-doencas.service';


@Component({
  selector: 'app-detalhes-sintomas-e-doencas',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    RatingStarsComponent,
    ListarHorariosDisponiveisComponent,
    FormFazerPerguntaComponent,
    GenericSimpleModalComponent,
    SigninAndSignupSuggestionComponent,
    DadosEspecialistaListaComponent,
    NumberThousandsFormattedPipe,
    IsNullOrUndefinedPipe,
    DateExtensoFormattedPipe,
    OrderByLoopCollectionPipe
  ],
  templateUrl: './detalhes-sintomas-e-doencas.component.html',
  styleUrl: './detalhes-sintomas-e-doencas.component.css'
})
export class DetalhesSintomasEDoencasComponent implements OnInit, OnDestroy {

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
  private sintomasDoencasService = inject(SintomasEDoencasService);

  sintomasDoencasId: number;
  sintomasDoencas: SintomasDoencasResponse;
  especialistas: EspecialistaResponse[] = [];
  hasNextPage: boolean | undefined = false;
  endPage: boolean = false;
  page: number = 1;
  itemsPerPage: number = 15;
  textoBotaoMaisEspecialistas: string = 'Mostrar mais';

  constructor() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.sintomasDoencasId = this.cryptoService.descriptografar(id!);
    this.obterDadosSintomasDoencas();
  }

  ngOnInit(): void {
    this.obterListaEspecialistasSintomasDoencas();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  obterDadosSintomasDoencas() {
    this.sintomasDoencasService.getSintomasDoencasById(this.sintomasDoencasId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.sintomasDoencas = response!;
        },
        error: (error) => this.notificationService.showHttpResponseErrorNotification(error)
      });
  }
  obterListaEspecialistasSintomasDoencas() {
    this.sintomasDoencasService.getSintomasDoencasEspecialistasByFilterPaged(this.sintomasDoencasId, null!, this.page, this.itemsPerPage, true)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const novos = response.data?.results ?? [];
          // concatena os novos com os já existentes
          this.especialistas = [
            ...this.especialistas,
            ...novos
          ];

          // controla se ainda há próxima página
          this.hasNextPage = !!response.data?.hasNextPage;

          // incrementa página para próxima chamada
          this.page++;
          this.textoBotaoMaisEspecialistas = 'Mostrar mais'
        },
        error: (error) => this.notificationService.showHttpResponseErrorNotification(error)
      });
  }

  onclick_carregarMais_especialistas() {
    if (!this.hasNextPage) {
      return; // opcional: não chama se não tiver próxima página
    }
    this.textoBotaoMaisEspecialistas = 'Carregando, aguarde ...'
    this.obterListaEspecialistasSintomasDoencas()
  }

  onclick_redirect_especialista_info(especialistaId: number) {
    this.router.navigate(['/especialista/'+ this.cryptoService.criptografar(especialistaId)]);
  }
}
