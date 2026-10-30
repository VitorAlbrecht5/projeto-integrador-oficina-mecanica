import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicosService } from '../servicos.service';
import { Servico } from '../servicos.model';

@Component({
  selector: 'app-servicos-lista',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './servicos-lista.html',
  styleUrls: ['./servicos-lista.css']
})
export class ServicosLista {
  private servicosService = inject(ServicosService);
  private fb = inject(FormBuilder);

  servicos = signal<Servico[]>(this.servicosService.obterServicos());
  exibirModal = false;
  modoEdicao = false;
  servicoIdEdicao: number | null = null;

  servicoForm: FormGroup = this.fb.group({
    nome: ['', [Validators.required]],
    descricao: ['', [Validators.required]],
    preco: ['', [Validators.required, Validators.min(0)]],
    tempoEstimado: ['', [Validators.required]]
  });

  abrirModalNovo() {
    this.modoEdicao = false;
    this.servicoIdEdicao = null;
    this.servicoForm.reset();
    this.exibirModal = true;
  }

  abrirModalEditar(servico: Servico) {
    this.modoEdicao = true;
    this.servicoIdEdicao = servico.id ?? null;
    this.servicoForm.patchValue(servico);
    this.exibirModal = true;
  }

  fecharModal() {
    this.exibirModal = false;
  }

  salvar() {
    if (this.servicoForm.invalid) return;

    const dados = this.servicoForm.value;
    if (this.modoEdicao && this.servicoIdEdicao) {
      this.servicosService.atualizarServico({ ...dados, id: this.servicoIdEdicao });
    } else {
      this.servicosService.adicionarServico(dados);
    }

    this.servicos.set(this.servicosService.obterServicos());
    this.fecharModal();
  }

  excluir(id?: number) {
    if (id && confirm('Deseja excluir este serviço?')) {
      this.servicosService.excluirServico(id);
      this.servicos.set(this.servicosService.obterServicos());
    }
  }
}