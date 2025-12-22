import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AppUtils } from 'src/app/core/utils/app.util';
import { DisplayValidationErrorsComponent } from 'src/app/shared/components/display-validation-errors/display-validation-errors.component';
import { FormFazerPerguntaComponent } from 'src/app/pages/perguntas-e-respostas/form-fazer-pergunta/form-fazer-pergunta.component';
import { InputCharacterCountDirective } from 'src/app/shared/directives/input-character-count.directive';
import { selectValidator, checkboxRequiredValidator } from 'src/app/core/utils/form-validators.util';
import { PerguntaResponse } from 'src/app/core/models/perguntas-respostas/response/PerguntaResponse';
import { EspecialidadeResponse } from 'src/app/core/models/especialidade/response/EspecialidadeResponse';
import { CreatePerguntaRequest } from 'src/app/core/models/perguntas-respostas/request/CreatePerguntaRequest';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { PerguntasRespostasService } from 'src/app/core/services/perguntas-respostas.service';
import { EspecialidadeService } from 'src/app/core/services/especialidade.service';
import { BsModalService } from 'src/app/shared/services/bs-modal.service';
import { CryptoService } from 'src/app/shared/services/crypto.service';
import { DateExtensoFormattedPipe } from 'src/app/shared/pipes/date-extenso-formatted.pipe';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';

@Component({
  selector: 'app-perguntas-e-respostas',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FormFazerPerguntaComponent,
    PaginationComponent,
    DisplayValidationErrorsComponent,
    InputCharacterCountDirective
  ],
  templateUrl: './listar-perguntas-e-respostas.component.html',
  styleUrl: './listar-perguntas-e-respostas.component.css'
})
export class PerguntasERespostasListarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private perguntaRespostaService = inject(PerguntasRespostasService);
  private especialidadeService = inject(EspecialidadeService);
  private authService = inject(AuthenticationService);
  private modalService = inject(BsModalService);
  private cryptoService = inject(CryptoService);

  isLogged = this.authService.isLoggedIn();
  showFormSection = false;

  perguntasList: PerguntaResponse[] = [];
  perguntasPaginadas: PerguntaResponse[] = [];
  perguntasFiltradas: PerguntaResponse[] = [];
  especialidades: EspecialidadeResponse[] = [];

  totalItems = 0;
  itemsPerPage = 15;
  currentPage = 1;

  form = this.formBuilder.group({
    pergunta: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(300)]],
    especialidadeId: ['', [Validators.required, selectValidator]],
    termosUsoPolitica: [false, [Validators.required, checkboxRequiredValidator]]
  });

  constructor() {
    this.getPerguntasList();
    this.getEspecialidadesList();
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getEspecialidadesList() {
    this.especialidadeService.getEspecialidades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.especialidades = response,
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      });
  }

  getPerguntasList(page: number = 1, pageSize: number = 20) {
    this.perguntaRespostaService.getPerguntasEspecialidadesPaged(page, pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.perguntasList = response.data!.results;
          this.totalItems = response.data!.total;
          this.currentPage = 1;
          this.atualizarPagina(this.currentPage, this.itemsPerPage);
        },
        error: (err) => {
          this.notificationService.showHttpResponseErrorNotification(err);
        }
      });
  }

  atualizarPagina(page: number, pageSize: number) {
    this.currentPage = Number(page);
    this.itemsPerPage = Number(pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Filtro da página atual
    this.perguntasPaginadas = this.perguntasList.slice(startIndex, endIndex);
  }

  onRedirect_Pergunta(id: number) {
    const perguntaId = this.cryptoService.criptografar(id);
    this.router.navigate(['/perguntas-e-respostas', perguntaId]);
  }

  onShowModalFazerPergunta() {
    if (this.isLogged) {
      this.modalService.abrirModal('modalFazerPergunta');
    } else {
      this.router.navigate(['/login']);
    }
  }

  getPerguntaRequestDataEmitted(request: CreatePerguntaRequest) {
    if (!AppUtils.isNullOrUndefined(request)) {
      this.perguntaRespostaService.createPerguntaEspecialidade(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.modalService.fecharModal('modalFazerPergunta')
          this.notificationService.showSuccessNotification('Pergunta', 'Pergunta enviada com sucesso');
          this.getPerguntasList();
        },
        error: (err) => this.notificationService.showHttpResponseErrorNotification(err)
      })
    }
  }

}
