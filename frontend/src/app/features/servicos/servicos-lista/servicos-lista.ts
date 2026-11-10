import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicosService } from '../servicos.service';
import { Servico, ServicoEntrada } from '../servicos.model';

@Component({
  selector: 'app-servicos-lista',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './servicos-lista.html',
  styleUrls: ['./servicos-lista.css'],
})
export class ServicosLista implements OnInit {
  private readonly service = inject(ServicosService);
  private readonly fb = inject(FormBuilder);
  servicos = signal<Servico[]>([]);
  carregando = signal(true);
  erro = signal<string | null>(null);
  readonly quantidadeVisivel = signal(10);
  readonly servicosVisiveis = computed(() => this.servicos().slice(0, this.quantidadeVisivel()));

  carregarMais(): void { this.quantidadeVisivel.update(qtd => qtd + 10); }
  exibirModal = false;
  modoEdicao = false;
  servicoIdEdicao: string | null = null;
  salvando = false;

  servicoForm: FormGroup = this.fb.group({
    nome: ['', [Validators.required]],
    descricao: ['', [Validators.required]],
    preco: [0, [Validators.required, Validators.min(0)]],
    tempoEstimado: ['', [Validators.required]],
  });

  ngOnInit(): void { this.carregar(); }
  carregar(): void {
    this.carregando.set(true);
    this.erro.set(null);
    this.quantidadeVisivel.set(10);
    this.service.obterServicos().subscribe({
      next: lista => { this.servicos.set(lista); this.carregando.set(false); },
      error: (e: Error) => { this.erro.set(e.message); this.carregando.set(false); },
    });
  }
  abrirModalNovo(): void {
    this.modoEdicao = false; this.servicoIdEdicao = null; this.servicoForm.reset({ preco: 0 });
    this.exibirModal = true;
  }
  abrirModalEditar(servico: Servico): void {
    this.modoEdicao = true; this.servicoIdEdicao = servico._id;
    this.servicoForm.patchValue(servico); this.exibirModal = true;
  }
  fecharModal(): void { this.exibirModal = false; }
  salvar(): void {
    if (this.servicoForm.invalid || this.salvando) { this.servicoForm.markAllAsTouched(); return; }
    const dados = this.servicoForm.getRawValue() as ServicoEntrada;
    const chamada = this.modoEdicao && this.servicoIdEdicao
      ? this.service.atualizarServico(this.servicoIdEdicao, dados)
      : this.service.adicionarServico(dados);
    this.salvando = true; this.erro.set(null);
    chamada.subscribe({
      next: () => { this.salvando = false; this.fecharModal(); this.carregar(); },
      error: (e: Error) => { this.salvando = false; this.erro.set(e.message); },
    });
  }
  excluir(id: string): void {
    if (!confirm('Deseja excluir este serviço?')) return;
    this.service.excluirServico(id).subscribe({
      next: () => this.carregar(),
      error: (e: Error) => this.erro.set(e.message),
    });
  }
}
