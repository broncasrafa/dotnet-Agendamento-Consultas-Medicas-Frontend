import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterLink, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticatedUserResponse } from 'src/app/core/models/account/response/AuthenticatedUserResponse';
import { ApiResponse } from 'src/app/core/models/ApiResponse';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<void> = new Subject<void>();

  private router = inject(Router);
  private authService = inject(AuthenticationService);
  private notificationService = inject(NotificationService);

  loginObj = {
    email: '',
    password: ''
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/inicio');
    }
  }

  onLogin() {
    this.authService.login(this.loginObj.email, this.loginObj.password)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response: ApiResponse<AuthenticatedUserResponse>) => {
        this.router.navigateByUrl('/inicio');
        this.notificationService.showSuccessNotification('Sucesso', `Bem vindo ${response.data!.usuario.nome}!`);
      },
      error: (err) => {
        this.notificationService.showHttpResponseErrorNotification(err);
        console.log(err);
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }





}
