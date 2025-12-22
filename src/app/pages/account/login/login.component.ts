import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DisplayValidationErrorsComponent } from 'src/app/shared/components/display-validation-errors/display-validation-errors.component';
import { ApiResponse } from 'src/app/core/models/ApiResponse';
import { AuthenticatedUserResponse } from 'src/app/core/models/account/response/AuthenticatedUserResponse';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { LoginRequest } from 'src/app/core/models/account/request/LoginRequest';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
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
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthenticationService);
  private notificationService = inject(NotificationService);

  mostrarSenha = false;
  returnUrl: string = '/';

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required ]],
  });

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    if (this.authService.isLoggedIn()) {
      if (this.returnUrl == '/') {
        this.router.navigateByUrl('/inicio');
      } else {
        this.router.navigateByUrl(this.returnUrl);
      }
    }
  }

  onLogin() {
    if (this.loginForm.value && this.loginForm.valid) {
      const request = this.loginForm.value as LoginRequest;
      this.authService.login(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse<AuthenticatedUserResponse>) => {
          if (this.returnUrl == '/') {
            this.router.navigateByUrl('/inicio');
          } else {
            this.router.navigateByUrl(this.returnUrl);
          }
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
