import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { OrdemServicoService } from '../services/ordem-servico.service';
import { StatusOrdemServico } from '../ordem-servico.model';
import { VeiculosService } from '../../veiculos/services/veiculos.service';
import { ServicosService } from '../../servicos/servicos.service';
import { Servico } from '../../servicos/servicos.model';

@Component({
  selector: 'app-ordem-servico-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ordem-servico-form.html',
  styleUrl: './ordem-servico-form.css',
})
export class OrdemServicoForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ordensService = inject(OrdemServicoService);
  private veiculosService = inject(VeiculosService);
  private servicosService = inject(ServicosService);

  readonly statusDisponiveis: StatusOrdemServico[] = [
    'Veículo recebido - Aguardando Avaliação',
    'Em manutenção',
    'Aguardando Peças',
    'Pronto para retirada',
  ];
  servicos: Servico[] = [];
  carregando = true;
  salvando = false;
  erro: string | null = null;
  private ordemId = '';
  private veiculoId = '';

  form = this.fb.group({
    descricaoProblema: ['', [Validators.required, Validators.maxLength(500)]],
    status: ['Veículo recebido - Aguardando Avaliação' as StatusOrdemServico, Validators.required],
    servicosIds: this.fb.control<number[]>([]),
  });

  ngOnInit(): void {
    this.servicos = this.servicosService.obterServicos();
    this.ordemId = this.route.snapshot.paramMap.get('id') ?? '';
    this.ordensService.obterPorId(this.ordemId).subscribe({
      next: ordem => {
        if (!ordem) {
          this.erro = 'Ordem de serviço não encontrada.';
          this.carregando = false;
          return;
        }
        this.veiculoId = ordem.veiculoId;
        this.form.patchValue({
          descricaoProblema: ordem.descricaoProblema,
          status: ordem.status,
          servicosIds: ordem.servicosIds ?? [],
        });
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar a ordem de serviço.';
        this.carregando = false;
      },
    });
  }

  servicoSelecionado(id: number): boolean {
    return (this.form.controls.servicosIds.value ?? []).includes(id);
  }

  alternarServico(id: number, marcado: boolean): void {
    const atuais = this.form.controls.servicosIds.value ?? [];
    this.form.controls.servicosIds.setValue(
      marcado ? [...atuais, id] : atuais.filter(item => item !== id),
    );
  }

  get valorTotal(): number {
    const ids = this.form.controls.servicosIds.value ?? [];
    return this.servicos.filter(s => s.id !== undefined && ids.includes(s.id))
      .reduce((total, servico) => total + servico.preco, 0);
  }

  salvar(): void {
    if (this.form.invalid || !this.ordemId) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando = true;
    this.erro = null;
    const dados = this.form.getRawValue();
    const status = dados.status as StatusOrdemServico;
    forkJoin([
      this.ordensService.atualizar(this.ordemId, {
        descricaoProblema: dados.descricaoProblema ?? '',
        status,
        servicosIds: dados.servicosIds ?? [],
      }),
      this.veiculosService.atualizar(this.veiculoId, { status }),
    ]).subscribe({
      next: () => {
        this.salvando = false;
        this.router.navigate(['/painel/ordem-servico']);
      },
      error: () => {
        this.salvando = false;
        this.erro = 'Não foi possível salvar as alterações. Tente novamente.';
      },
    });
  }
}
