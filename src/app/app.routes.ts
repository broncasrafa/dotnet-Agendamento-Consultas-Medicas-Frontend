import { Routes } from '@angular/router';
import { authGuard } from 'src/app/core/guard/auth.guard';

export const routes: Routes = [
  {
    path:'',
    redirectTo: 'login',
    pathMatch:'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/account/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'esqueci-senha',
    loadComponent: () => import('./pages/account/esqueci-senha/esqueci-senha.component').then(c => c.EsqueciSenhaComponent)
  },
  {
    path: 'paciente/registrar',
    loadComponent: () => import('./pages/account/register/paciente/paciente.component').then(c => c.RegistrarPacienteComponent)
  },
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(c => c.LayoutComponent),
    children: [
      {
        path: 'inicio',
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
        path: 'conta/mudar-senha',
        loadComponent: () => import('./pages/account/mudar-senha/mudar-senha.component').then(c => c.MudarSenhaComponent),
        canActivate: [authGuard]
      }
    ]
  },


];
