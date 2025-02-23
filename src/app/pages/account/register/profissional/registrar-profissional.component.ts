import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, RouterLink, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AccountService } from 'src/app/core/services/account.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { EspecialidadeService } from 'src/app/core/services/especialidade.service';
import { DisplayValidationErrorsComponent } from 'src/app/shared/components/display-validation-errors/display-validation-errors.component';
import { EspecialidadeResponse } from 'src/app/core/models/especialidade/response/EspecialidadeResponse';
import { RegisterEspecialistaRequest } from 'src/app/core/models/account/request/RegisterEspecialistaRequest';
import {
  fullNameValidator,
  matchPasswordsValidator,
  passwordComplexityValidator,
  phoneNumberValidator,
  selectValidator
} from 'src/app/core/utils/form-validators.util';


@Component({
  selector: 'app-registrar-profissional',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    DisplayValidationErrorsComponent,
    NgxMaskDirective
  ],
  providers: [
    provideNgxMask()
  ],
  templateUrl: './registrar-profissional.component.html',
  styleUrl: './registrar-profissional.component.css'
})
export class RegistrarProfissionalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private accountService = inject(AccountService);
  private notificationService = inject(NotificationService);
  private especialidadeService = inject(EspecialidadeService);

  especialidades: EspecialidadeResponse[] = [];

  signupForm = this.formBuilder.group({
    nomeCompleto: ['', [Validators.required, fullNameValidator]],
    username: ['', [Validators.required, Validators.minLength(6)]],
    email: ['', [Validators.required, Validators.email]],
    tipoCategoria: ['', [Validators.required, selectValidator]],
    especialidadeId: ['', [Validators.required, selectValidator]],
    genero: ['', [Validators.required]],
    licenca: ['', [Validators.required]],
    telefone: ['', [Validators.required, phoneNumberValidator]],
    password: ['', [Validators.required, passwordComplexityValidator]],
    confirmPassword: ['', [Validators.required]],
    isAgreeTerms: [false, [Validators.required]],
    isAgreeComunications: [false, [Validators.required]]
  }, { validators: matchPasswordsValidator });


  constructor() { }

  ngOnInit() {
    this.getListaEspecialidades();
  }

  onRegisterSubmit() {
    if (this.signupForm.value && this.signupForm.valid) {
      const request = new RegisterEspecialistaRequest(
        this.signupForm.value.nomeCompleto!,
        this.signupForm.value.username!,
        this.signupForm.value.email!,
        this.signupForm.value.tipoCategoria!,
        Number(this.signupForm.value.especialidadeId),
        this.signupForm.value.genero!,
        this.signupForm.value.licenca!,
        this.signupForm.value.telefone!,
        this.signupForm.value.password!,
        this.signupForm.value.confirmPassword!
      );

      this.accountService.registerEspecialista(request)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.notificationService.showSuccessNotification('Cadastro', 'Registro realizado com sucesso');
            this.router.navigate(['/inicio']);
          },
          error: (err) => this.notificationService.showHttpResponseErrorNotification(err)
        });

    }
  }

  getListaEspecialidades() {
    this.especialidadeService.getEspecialidades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.especialidades = response,
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
