import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent)
  },
  {
    path: 'sobre-nos',
    loadComponent: () => import('./pages/about-us/about-us.component').then(c => c.AboutUsComponent)
  },
  {
    path: 'perguntas-e-respostas',
    loadComponent: () => import('./pages/perguntas-e-respostas/perguntas-e-respostas.component').then(c => c.PerguntasERespostasComponent)
  },
  {
    path: 'conta/esqueci-senha',
    loadComponent: () => import('./pages/account/esqueci-senha/esqueci-senha.component').then(c => c.EsqueciSenhaComponent)
  },
  {
    path: 'conta/mudar-senha',
    loadComponent: () => import('./pages/account/mudar-senha/mudar-senha.component').then(c => c.MudarSenhaComponent)
  },
  {
    path: 'conta/paciente/login',
    loadComponent: () => import('./pages/account/login-paciente/login-paciente.component').then(c => c.LoginPacienteComponent)
  },
  {
    path: 'conta/paciente/registrar',
    loadComponent: () => import('./pages/account/registrar-paciente/registrar-paciente.component').then(c => c.RegistrarPacienteComponent)
  }
];
