import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, RouterLink, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { RegisterPacienteRequest } from 'src/app/core/models/account/request/RegisterPacienteRequest';
import { AccountService } from 'src/app/core/services/account.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DisplayValidationErrorsComponent } from 'src/app/shared/components/display-validation-errors/display-validation-errors.component';
import {
  allDigitsEqualValidator,
  cpfValidator,
  dateOfBirthFormatValidator,
  fullNameValidator,
  matchPasswordsValidator,
  passwordComplexityValidator,
  phoneNumberValidator
} from 'src/app/core/utils/form-validators.util';

@Component({
  selector: 'app-registrar-paciente',
  standalone: true,
  imports: [
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
  templateUrl: './registrar-paciente.component.html',
  styleUrl: './registrar-paciente.component.css'
})
export class RegistrarPacienteComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private accountService = inject(AccountService);
  private notificationService = inject(NotificationService);

  signupForm = this.formBuilder.group({
    nomeCompleto: ['', [Validators.required, fullNameValidator]],
    cpf: ['', [Validators.required, cpfValidator]],
    username: ['', [Validators.required, Validators.minLength(6)]],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required, phoneNumberValidator]],
    genero: ['', [Validators.required]],
    dataNascimento: ['', [Validators.required, dateOfBirthFormatValidator(false)]],
    password: ['', [Validators.required, passwordComplexityValidator]],
    confirmPassword: ['', [Validators.required]],
    isAgreeTerms: [false, [Validators.required]],
    isAgreeComunications: [false, [Validators.required]]
  }, { validators: matchPasswordsValidator });

  constructor() { }

  onRegisterSubmit() {
    console.log(this.signupForm);
    if (this.signupForm.value && this.signupForm.valid) {
      const request = this.signupForm.value as RegisterPacienteRequest;
      console.log(request);
      // this.accountService.registerPaciente(request)
      //   .pipe(takeUntil(this.destroy$))
      //   .subscribe({
      //     next: (response) => {
      //       this.signupForm.reset();
      //       this.notificationService.showSuccessNotification('Cadastrado com sucesso', 'Paciente registrado con éxito');
      //       this.router.navigate(['/login']);
      //     },
      //     error: (err) => this.notificationService.showHttpResponseErrorNotification(err)
      //   });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
