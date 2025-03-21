import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AppUtils } from 'src/app/core/utils/app.util';
import { selectValidator, checkboxRequiredValidator } from 'src/app/core/utils/form-validators.util';
import { InputCharacterCountDirective } from 'src/app/shared/directives/input-character-count.directive';
import { DisplayValidationErrorsComponent } from 'src/app/shared/components/display-validation-errors/display-validation-errors.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { EspecialidadeService } from 'src/app/core/services/especialidade.service';
import { EspecialidadeResponse } from 'src/app/core/models/especialidade/response/EspecialidadeResponse';
import { CreatePerguntaRequest } from 'src/app/core/models/perguntas-respostas/request/CreatePerguntaRequest';

@Component({
  selector: 'app-form-fazer-pergunta',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    DisplayValidationErrorsComponent,
    InputCharacterCountDirective
  ],
  templateUrl: './form-fazer-pergunta.component.html',
  styleUrl: './form-fazer-pergunta.component.css'
})
export class FormFazerPerguntaComponent implements OnInit, OnDestroy {
  @Input() showEspecialidades: boolean = true;
  @Input() especialidadeId?: string = undefined;
  @Output() requestData = new EventEmitter<CreatePerguntaRequest>();

  private destroy$ = new Subject<void>();

  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthenticationService);
  private notificationService = inject(NotificationService);
  private especialidadeService = inject(EspecialidadeService);


  especialidades: EspecialidadeResponse[] = [];

  form = this.formBuilder.group({
    pergunta: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(300)]],
    especialidadeId: ['', [Validators.required, selectValidator]],
    termosUsoPolitica: [false, [Validators.required, checkboxRequiredValidator]]
  });

  constructor() {
    if (this.showEspecialidades) {
      this.getEspecialidadesList();
    }
    this.form.controls.especialidadeId.setValue("0");
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
        next: (response) => this.especialidades = AppUtils.orderByAscending(response, 'nome'),
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      });
  }

  onEnviarDadosPergunta(formDirective: FormGroupDirective) {
    if (!this.showEspecialidades) {
      this.form.controls.especialidadeId.setValue("0");
    }

    if (this.form.value && this.form.valid) {
      const user = this.authService.getUserInfo();
      const request = {
        especialidadeId: Number(this.form.value.especialidadeId),
        especialistaId: 0,
        pacienteId: user.id!,
        pergunta: this.form.value.pergunta!,
        termosUsoPolitica: this.form.value.termosUsoPolitica!
      } as CreatePerguntaRequest;

      AppUtils.resetForm(formDirective, this.form);

      this.requestData.emit(request);
    }
  }
}
