import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BsModalService } from 'src/app/shared/services/bs-modal.service';

@Component({
  selector: 'app-signin-and-signup-suggestion',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './signin-and-signup-suggestion.component.html',
  styleUrl: './signin-and-signup-suggestion.component.css'
})
export class SigninAndSignupSuggestionComponent {

  private router = inject(Router);
  private modalService = inject(BsModalService);

  showModal() {
    this.modalService.abrirModal('modalFazerLogin');
  }

  onclick_redirect_login() {
    console.log('onclick_redirect_login', this.router.url);
    this.modalService.fecharModal('modalFazerLogin');
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
  }
  onclick_redirect_register() {
    console.log('onclick_redirect_register', this.router.url);
    this.modalService.fecharModal('modalFazerLogin');
    this.router.navigate(['/paciente/registrar'], { queryParams: { returnUrl: this.router.url } });
  }
}
