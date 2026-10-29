import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrdemServicoMockService } from '../services/ordem-servico-mock.service';
import { OrdemServico, StatusOrdemServico } from '../ordem-servico-card/ordem-servico.model';

@Component({
  selector: 'app-ordem-servico-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ordem-servico-form.html',
  styleUrls: ['./ordem-servico-form.css']
})
export class OrdemServicoForm implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ordemService = inject(OrdemServicoMockService);

  ordemId = signal<string | null>(null);
  
  // Modelo para o formulário
  descricaoProblema = signal('');
  status = signal<StatusOrdemServico>('Veículo recebido - Aguardando Avaliação');

  listaStatus: StatusOrdemServico[] = [
    'Veículo recebido - Aguardando Avaliação',
    'Em manutenção',
    'Aguardando Peças',
    'Pronto para retirada'
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.ordemId.set(id);
      this.ordemService.obterPorId(id).subscribe((ordem) => {
        if (ordem) {
          this.descricaoProblema.set(ordem.descricaoProblema);
          this.status.set(ordem.status);
        }
      });
    }
  }

  salvar(): void {
    const id = this.ordemId();
    if (id) {
      this.ordemService.atualizar(id, {
        descricaoProblema: this.descricaoProblema(),
        status: this.status()
      }).subscribe(() => {
        // Redireciona de volta para a lista após guardar
        this.router.navigate(['/ordem-servico']);
      });
    }
  }
}