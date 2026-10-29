import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Inicio } from './pages/inicio/inicio';
import { NaoEncontrado } from './pages/nao-encontrado/nao-encontrado';
import { OrdemServicoLista } from './features/ordem-servico/ordem-servico-lista/ordem-servico-lista';
import { Login } from './features/login/login';

/**
 * Mapa de rotas da aplicação.
 */
export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: Inicio, title: 'Início' },
      { path: 'login', component: Login, title: 'Login' },
      {
        path: 'produtos',
        loadChildren: () =>
          import('./features/produtos/produtos.routes').then(
            (m) => m.PRODUTOS_ROUTES
          ),
      },
      {
        path: 'ordem-servico',
        component: OrdemServicoLista,
        title: 'Ordens de Serviço',
      },
      {
        path: 'veiculos',
        loadChildren: () =>
          import('./features/veiculos/veiculos.routes').then(
            (m) => m.VEICULOS_ROUTES
          ),
      },
    ],
  },
  { path: '**', component: NaoEncontrado, title: 'Página não encontrada' },
];