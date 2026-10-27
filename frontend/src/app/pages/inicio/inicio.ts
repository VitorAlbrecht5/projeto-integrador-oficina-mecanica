import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  template: `
    <h1>Bem-vindo</h1>
    <p>Este é o projeto base do Projeto Integrador. Use o módulo
      <a routerLink="/painel/produtos">Produtos</a> como modelo para construir o módulo do seu domínio.</p>
    <!-- TODO (aula 11): o aluno do módulo de Relatórios coloca aqui os indicadores do sistema -->
  `,
})
export class Inicio {}
