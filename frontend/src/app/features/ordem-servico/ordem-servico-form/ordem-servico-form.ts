import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly ordensService = inject(OrdemServicoService);
  private readonly veiculosService = inject(VeiculosService);
  private readonly servicosService = inject(ServicosService);

  readonly statusDisponiveis: StatusOrdemServico[] = ['Na Fila', 'Em Conserto', 'Aguardando Peça', 'Pronto'];
  servicos: Servico[] = [];
  carregando = true;
  carregandoServicos = true;
  salvando = false;
  erro: string | null = null;
  ordemId = '';
  veiculoId = '';
  finalizada = false;
  get nova(): boolean { return !this.ordemId; }

  form = this.fb.group({
    descricaoProblema: ['', [Validators.required, Validators.maxLength(500)]],
    status: ['Na Fila' as StatusOrdemServico, Validators.required],
    servicosIds: this.fb.control<string[]>([]),
  });

  ngOnInit(): void {
    this.ordemId = this.route.snapshot.paramMap.get('id') ?? '';
    this.veiculoId = this.route.snapshot.paramMap.get('veiculoId') ?? '';
    this.servicosService.obterServicos().subscribe({
      next: servicos => { this.servicos = servicos; this.carregandoServicos = false; },
      error: (e: Error) => { this.erro = `Falha ao carregar serviços: ${e.message}`; this.carregandoServicos = false; },
    });
    if (this.ordemId) {
      this.ordensService.obterPorId(this.ordemId).subscribe({
        next: ordem => {
          if (!ordem) { this.erro = 'Ordem não encontrada.'; this.carregando = false; return; }
          this.veiculoId = ordem.veiculoId;
          this.form.patchValue({
            descricaoProblema: ordem.descricaoProblema,
            status: ordem.status,
            servicosIds: ordem.servicosIds ?? [],
          });
          if (ordem.status === 'Pronto') {
            this.finalizada = true;
            this.form.disable();
          }
          this.carregando = false;
        },
        error: (e: Error) => { this.erro = e.message; this.carregando = false; },
      });
    } else if (this.veiculoId) {
      this.veiculosService.buscarPorId(this.veiculoId).subscribe({
        next: veiculo => { this.form.patchValue({ descricaoProblema: veiculo.defeitoRelatado }); this.carregando = false; },
        error: (e: Error) => { this.erro = e.message; this.carregando = false; },
      });
    } else { this.erro = 'Veículo não informado.'; this.carregando = false; }
  }

  servicoSelecionado(id: string): boolean { return (this.form.controls.servicosIds.value ?? []).includes(id); }
  alternarServico(id: string, marcado: boolean): void {
    const atuais = this.form.controls.servicosIds.value ?? [];
    this.form.controls.servicosIds.setValue(marcado ? [...atuais, id] : atuais.filter(x => x !== id));
  }
  get valorTotal(): number {
    const ids = this.form.controls.servicosIds.value ?? [];
    return this.servicos.filter(s => ids.includes(s._id)).reduce((total, s) => total + s.preco, 0);
  }
  salvar(): void {
    if (this.finalizada || this.form.invalid || this.salvando) { this.form.markAllAsTouched(); return; }
    const d = this.form.getRawValue();
    this.salvando = true; this.erro = null;
    const chamado = this.nova
      ? this.ordensService.criar({
          veiculoId: this.veiculoId,
          descricaoProblema: d.descricaoProblema ?? '',
          servicosIds: d.servicosIds ?? [],
        })
      : this.ordensService.atualizar(this.ordemId, {
          descricaoProblema: d.descricaoProblema ?? '',
          status: d.status as StatusOrdemServico,
          servicosIds: d.servicosIds ?? [],
        });
    chamado.subscribe({
      next: () => { this.salvando = false; this.router.navigate(['/painel/ordem-servico']); },
      error: (e: Error) => { this.salvando = false; this.erro = e.message; },
    });
  }
}
