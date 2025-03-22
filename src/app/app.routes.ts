import { Routes } from '@angular/router';
import { authGuard } from 'src/app/core/guard/auth.guard';

export const routes: Routes = [
  {
    path:'',
    redirectTo: 'inicio',
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
    loadComponent: () => import('./pages/account/register/paciente/registrar-paciente.component').then(c => c.RegistrarPacienteComponent)
  },
  {
    path: 'profissional/registrar',
    loadComponent: () => import('./pages/account/register/profissional/registrar-profissional.component').then(c => c.RegistrarProfissionalComponent)
  },
  {
    path: '404-page',
    loadComponent: () => import('./pages/error-pages/not-found/not-found.component').then(c => c.NotFoundComponent)
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
        loadComponent: () => import('./pages/perguntas-e-respostas/listar/listar-perguntas-e-respostas.component').then(c => c.PerguntasERespostasListarComponent)
      },
      {
        path: 'perguntas-e-respostas/:id',
        loadComponent: () => import('./pages/perguntas-e-respostas/detalhes/detalhes-perguntas-e-respostas.component').then(c => c.PerguntasERespostasDetalhesComponent)
      },
      {
        path: 'conta/mudar-senha',
        loadComponent: () => import('./pages/account/mudar-senha/mudar-senha.component').then(c => c.MudarSenhaComponent),
        canActivate: [authGuard]
      },
      {
        path: 'agendamento',
        loadComponent: () => import('./pages/consulta/agendamento/agendamento.component').then(c => c.AgendamentoConsultaComponent),
        canActivate: [authGuard]
      },
      {
        path: 'especialistas/pesquisa',
        loadComponent: () => import('./pages/especialista/pesquisar-especialista/pesquisar-especialista.component').then(c => c.PesquisarEspecialistaComponent)
      },

      // paciente
      {
        path: 'paciente/consultas',
        loadComponent: () => import('./pages/paciente/listar-consultas/consultas-paciente.component').then(c => c.ConsultasPacienteComponent),
        canActivate: [authGuard]
      },
      {
        path: 'paciente/consultas/:id',
        loadComponent: () => import('./pages/paciente/detalhes-consultas/consultas-paciente-detalhes.component').then(c => c.ConsultasPacienteDetalhesComponent),
        canActivate: [authGuard]
      },
      {
        path: 'paciente/conta',
        loadComponent: () => import('./pages/paciente/dados-conta/dados-conta-paciente.component').then(c => c.DadosContaPacienteComponent),
        canActivate: [authGuard]
      },
      {
        path: 'paciente/dependente',
        loadComponent: () => import('./pages/paciente/dependentes/pacientes-dependentes.component').then(c => c.PacientesDependentesComponent),
        canActivate: [authGuard]
      },
      {
        path: 'paciente/dependente/:id',
        loadComponent: () => import('./pages/paciente/dependentes-detalhes/pacientes-dependentes-detalhes.component').then(c => c.PacientesDependentesDetalhesComponent),
        canActivate: [authGuard]
      },
      {
        path: 'paciente/painel',
        loadComponent: () => import('./pages/paciente/painel/painel-paciente.component').then(c => c.PainelPacienteComponent),
        canActivate: [authGuard]
      },
      {
        path: 'paciente/favoritos',
        loadComponent: () => import('./pages/paciente/favoritos/favoritos-paciente.component').then(c => c.FavoritosPacienteComponent),
        canActivate: [authGuard]
      },

      // especialista
      {
        path: 'especialista/:id',
        loadComponent: () => import('./pages/especialista/detalhes-especialista/detalhes-especialista.component').then(c => c.DetalhesEspecialistaComponent),
        canActivate: [authGuard]
      },

      // especialidade
      {
        path: 'especialidades',
        loadComponent: () => import('./pages/especialidades/listar-especialidades/listar-especialidades.component').then(c => c.ListarEspecialidadesComponent),
        canActivate: [authGuard]
      },
      {
        path: 'especialidades/:term/especialistas',
        loadComponent: () => import('./pages/especialidades/listar-especialistas-especialidade/listar-especialistas-especialidade.component').then(c => c.ListarEspecialistasEspecialidadeComponent),
        canActivate: [authGuard]
      },
    ]
  },


];
