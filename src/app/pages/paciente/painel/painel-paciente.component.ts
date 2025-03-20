import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-painel-paciente',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './painel-paciente.component.html',
  styleUrl: './painel-paciente.component.css'
})
export class PainelPacienteComponent {

  private destroy$ = new Subject<void>();

  private router = inject(Router);

  navigateTo(url: string) {
    this.router.navigate([url])
  }

  onRedirect_MinhasConsultas() {
    this.navigateTo('/paciente/consultas');
  }

  onRedirect_PergunteAoProfissional() {
    this.navigateTo('/perguntas-e-respostas');
  }

  onRedirect_MeuProfissionaisFavoritos() {
    this.navigateTo('/paciente/favoritos');
  }

  onRedirect_AgendarConsulta() {
    this.navigateTo('/inicio');
  }

  onRedirect_PacientesDependentes() {
    this.navigateTo('/paciente/dependente');
  }

  onRedirect_EditarConta() {
    this.navigateTo('/paciente/conta');
  }
}
