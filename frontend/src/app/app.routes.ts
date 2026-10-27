import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { PaginaPublica } from './features/pagina-publica/pagina-publica';
import { NaoEncontrado } from './pages/nao-encontrado/nao-encontrado';
import { OrdemServicoLista } from './features/ordem-servico/ordem-servico-lista/ordem-servico-lista';
import { LoginComponent } from './features/login/login.component';
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
        component: OrdemServicoLista,
        title: 'Ordens de Serviço',
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
