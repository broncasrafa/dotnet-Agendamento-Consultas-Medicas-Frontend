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
import { LoadingService } from 'src/app/shared/services/loading.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { PerguntasRespostasService } from 'src/app/core/services/perguntas-respostas.service';
import { EspecialidadeService } from 'src/app/core/services/especialidade.service';
import { BsModalService } from 'src/app/shared/services/bs-modal.service';

@Component({
  selector: 'app-perguntas-e-respostas',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    DisplayValidationErrorsComponent,
    FormFazerPerguntaComponent,
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
  private loadingService = inject(LoadingService);

  perguntasList: PerguntaResponse[] = [];
  especialidades: EspecialidadeResponse[] = [];
  isLogged = this.authService.isLoggedIn();
  showFormSection = false;

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

  getPerguntasList(page: number = 1, pageSize: number = 20) {
    this.perguntaRespostaService.getPerguntasEspecialidadesPaged(page, pageSize)
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

  getEspecialidadesList() {
    this.especialidadeService.getEspecialidades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.especialidades = response,
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      });
  }

  onRedirect_Pergunta(id: number) {
    this.router.navigate(['/perguntas-e-respostas', id]);
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
