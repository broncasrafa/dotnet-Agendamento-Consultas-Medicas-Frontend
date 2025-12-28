import { Component } from '@angular/core';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { AppConstants } from 'src/app/core/constants/app.const';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  emailContato = AppConstants.EMAIL_CONTATO;
  telefoneContato = AppConstants.TELEFONE_CONTATO;
  currentYear: number = new Date().getFullYear();
}
