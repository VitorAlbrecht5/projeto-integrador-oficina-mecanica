import {
  ApplicationConfig,
  provideZoneChangeDetection,
  LOCALE_ID
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { routes } from './app.routes';

import { ProdutosService } from './features/produtos/services/produtos.service';
import { ProdutosMockService } from './features/produtos/services/produtos-mock.service';

// Corrigido para ServicosService (com "s" no final)
import { ServicosService } from './features/servicos/servicos.service';

import { OrdemServicoMockService } from './features/ordem-servico/services/ordem-servico-mock.service';
import { OrdemServicoService } from './features/ordem-servico/services/ordem-servico.service';

import { VeiculosService } from './features/veiculos/services/veiculos.service';
import { VeiculosMockService } from './features/veiculos/services/veiculos-mock.service';


registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),

    { provide: LOCALE_ID, useValue: 'pt-BR' },

    { provide: ProdutosService, useClass: ProdutosMockService },
    
    // Como o seu ServicosService usa dados locais simulados diretamente na classe, 
    // basta registrá-lo diretamente aqui sem precisar de um Mock separado:
    ServicosService, 

    { provide: OrdemServicoService, useClass: OrdemServicoMockService },
    { provide: VeiculosService, useClass: VeiculosMockService },
  ]
};