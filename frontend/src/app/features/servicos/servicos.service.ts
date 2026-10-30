import { Injectable } from '@angular/core';
import { Servico } from './servicos.model';

@Injectable({
  providedIn: 'root'
})
export class ServicosService {
  private servicos: Servico[] = [
    { id: 1, nome: 'Troca de Óleo', descricao: 'Substituição do óleo do motor e filtro', preco: 150.00, tempoEstimado: '45 min' },
    { id: 2, nome: 'Alinhamento e Balanceamento', descricao: 'Ajuste da geometria da suspensão e rodas', preco: 120.00, tempoEstimado: '1 hora' },
    { id: 3, nome: 'Troca de Pastilhas de Freio', descricao: 'Substituição das pastilhas dianteiras', preco: 250.00, tempoEstimado: '1h 30min' }
  ];

  obterServicos(): Servico[] {
    return this.servicos;
  }

  adicionarServico(servico: Servico): void {
    servico.id = new Date().getTime();
    this.servicos.push(servico);
  }

  atualizarServico(servicoAtualizado: Servico): void {
    const index = this.servicos.findIndex(s => s.id === servicoAtualizado.id);
    if (index !== -1) {
      this.servicos[index] = servicoAtualizado;
    }
  }

  excluirServico(id: number): void {
    this.servicos = this.servicos.filter(s => s.id !== id);
  }
}