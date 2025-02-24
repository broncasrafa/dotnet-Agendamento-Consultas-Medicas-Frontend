import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DisplayValidationErrorsComponent } from 'src/app/shared/components/display-validation-errors/display-validation-errors.component';
import { InputCharacterCountDirective } from 'src/app/shared/directives/input-character-count.directive';
import { PerguntaResponse } from 'src/app/core/models/perguntas-respostas/response/PerguntaResponse';
import { EspecialidadeResponse } from 'src/app/core/models/especialidade/response/EspecialidadeResponse';
import { PerguntasRespostasService } from 'src/app/core/services/perguntas-respostas.service';
import { CreatePerguntaRequest } from 'src/app/core/models/perguntas-respostas/request/CreatePerguntaRequest';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { EspecialidadeService } from 'src/app/core/services/especialidade.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { selectValidator, checkboxRequiredValidator } from 'src/app/core/utils/form-validators.util';
import { AppUtils } from 'src/app/core/utils/app.util';

@Component({
  selector: 'app-perguntas-e-respostas',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
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

  perguntasList: PerguntaResponse[] = [];
  especialidades: EspecialidadeResponse[] = [];
  isLogged = this.authService.isLoggedIn();
  showFormSection = false;

  form = this.formBuilder.group({
    pergunta: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(300)]],
    especialidadeId: ['', [Validators.required, selectValidator]],
    termosUsoPolitica: [false, [Validators.required, checkboxRequiredValidator]]
  });

  constructor() { }

  ngOnInit(): void {
    this.getPerguntasList();
    this.getEspecialidadesList();
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

  getEspecialidadesList() {
    this.especialidadeService.getEspecialidades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.especialidades = response,
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      });
  }

  onRedirectPergunta(id: number) {
    this.router.navigate(['/perguntas-e-respostas', id]);
  }

  onShowForm() {
    if (this.isLogged) {
      this.showFormSection = true;
    } else {
      this.router.navigate(['/login']);
    }
  }

  onEnviarPergunta(formDirective: FormGroupDirective) {
    if (this.form.value && this.form.valid) {
      const user = this.authService.getUserInfo();
      const request = new CreatePerguntaRequest(
        Number(this.form.value.especialidadeId),
        user.id!,
        this.form.value.pergunta!,
        this.form.value.termosUsoPolitica!);

      this.perguntaRespostaService.createPergunta(request)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.notificationService.showSuccessNotification('Pergunta', 'Pergunta enviada com sucesso');
            this.showFormSection = false;
            AppUtils.resetForm(formDirective, this.form);
            this.getPerguntasList();
          },
          error: (err) => this.notificationService.showHttpResponseErrorNotification(err)
        })
    }

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
