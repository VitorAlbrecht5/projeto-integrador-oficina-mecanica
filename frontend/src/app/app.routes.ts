import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { PaginaPublica } from './features/pagina-publica/pagina-publica';
import { NaoEncontrado } from './pages/nao-encontrado/nao-encontrado';
import { OrdemServicoLista } from './features/ordem-servico/ordem-servico-lista/ordem-servico-lista';
import { OrdemServicoForm } from './features/ordem-servico/ordem-servico-form/ordem-servico-form';
import { LoginComponent } from './features/login/login.component';
import { authGuard } from './features/login/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: PaginaPublica,
    title: 'Garagem Pro',
  },
  {
    path: 'painel',
    component: Layout,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'relatorios',
        pathMatch: 'full',
      },
      {
        path: 'servicos',
        loadChildren: () =>
          import('./features/servicos/servicos.routes').then((m) => m.SERVICOS_ROUTES),
      },
      {
        path: 'produtos',
        loadChildren: () =>
          import('./features/produtos/produtos.routes').then((m) => m.PRODUTOS_ROUTES),
      },
      {
        path: 'ordem-servico',
        children: [
          { path: '', component: OrdemServicoLista, title: 'Ordens de Serviço' },
          { path: 'editar/:id', component: OrdemServicoForm, title: 'Editar Ordem de Serviço' },
          { path: 'nova/:veiculoId', component: OrdemServicoForm, title: 'Nova Ordem de Serviço' },
        ],
      },
      {
        path: 'veiculos',
        loadChildren: () =>
          import('./features/veiculos/veiculos.routes').then((m) => m.VEICULOS_ROUTES),
      },
      {
        path: 'relatorios',
        loadChildren: () =>
          import('./features/relatorios/relatorios.routes').then((m) => m.RELATORIOS_ROUTES),
      },
      {
        path: 'cliente',
        loadChildren: () =>
          import('./features/clientes/cliente.routes').then((m) => m.CLIENTE_ROUTES),
      },
    ],
  },
  {
    path: '**',
    component: NaoEncontrado,
    title: 'Página não encontrada',
  },
];
