import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, RouterLink, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DisplayValidationErrorsComponent } from 'src/app/shared/components/display-validation-errors/display-validation-errors.component';
import { ApiResponse } from 'src/app/core/models/ApiResponse';
import { AuthenticatedUserResponse } from 'src/app/core/models/account/response/AuthenticatedUserResponse';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { LoginRequest } from 'src/app/core/models/account/request/LoginRequest';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    DisplayValidationErrorsComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<void> = new Subject<void>();

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthenticationService);
  private notificationService = inject(NotificationService);

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required ]],
  });

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/inicio');
    }
  }

  onLogin() {
    if (this.loginForm.value && this.loginForm.valid) {
      const request = this.loginForm.value as LoginRequest;
      this.authService.login(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse<AuthenticatedUserResponse>) => {
          this.router.navigateByUrl('/inicio');
          this.notificationService.showSuccessNotification('Sucesso', `Bem vindo ${response.data!.usuario.nome}!`);
        },
        error: (err) => this.notificationService.showHttpResponseErrorNotification(err)
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
