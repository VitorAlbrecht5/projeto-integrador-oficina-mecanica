import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { VeiculosService } from '../services/veiculos.service';
import { ClienteService } from '../../clientes/cliente.service';
import { Cliente } from '../../clientes/cliente.model';

@Component({
  selector: 'app-veiculo-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './veiculo-form.html',
  styleUrls: ['./veiculo-form.css'],
})
export class VeiculoFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly veiculosService = inject(VeiculosService);
  private readonly clienteService = inject(ClienteService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  form!: FormGroup;
  salvando = false;
  carregando = false;
  carregandoClientes = true;
  erro: string | null = null;
  erroImagem = false;
  clientes: Cliente[] = [];
  idVeiculo: string | null = null;

  readonly anoMinimo = 1950;
  readonly anoMaximo = new Date().getFullYear() + 1;

  get modoEdicao() { return this.idVeiculo !== null; }

  ngOnInit() {
    this.iniciarFormulario();
    this.idVeiculo = this.route.snapshot.paramMap.get('id');
    this.clienteService.carregarClientes().subscribe({
      next: clientes => { this.clientes = clientes; this.carregandoClientes = false; },
      error: (erro: Error) => {
        this.erro = `Não foi possível carregar os clientes: ${erro.message}`;
        this.carregandoClientes = false;
      },
    });
    if (this.modoEdicao) this.carregarVeiculo();
  }

  iniciarFormulario() {
    this.form = this.fb.group({
      placa: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/i)]],
      clienteId: [null, Validators.required],
      modelo: ['', Validators.required],
      cor: ['', Validators.required],
      ano: ['', [Validators.required, Validators.min(this.anoMinimo), Validators.max(this.anoMaximo)]],
      defeitoRelatado: ['', Validators.required],
      imagemUrl: [''],
    });
  }

  carregarVeiculo() {
    if (!this.idVeiculo) return;
    this.carregando = true;
    this.veiculosService.buscarPorId(this.idVeiculo).subscribe({
      next: veiculo => {
        this.form.patchValue({
          placa: veiculo.placa,
          clienteId: veiculo.clienteId,
          modelo: veiculo.modelo,
          cor: veiculo.cor,
          ano: veiculo.ano,
          defeitoRelatado: veiculo.defeitoRelatado,
          imagemUrl: veiculo.imagemUrl ?? '',
        });
        this.form.get('placa')?.disable();
        if (!veiculo.ativo) {
          this.form.disable();
          this.erro = 'Este veículo está desativado. Ative-o na lista antes de editar.';
        }
        this.carregando = false;
      },
      error: (erro: Error) => {
        this.erro = `Não foi possível carregar o veículo: ${erro.message}`;
        this.carregando = false;
      },
    });
  }

  normalizarPlaca() {
    const campo = this.form.get('placa');
    if (!campo || campo.disabled) return;
    campo.setValue(String(campo.value ?? '').trim().replace(/-/g, '').toUpperCase(), {
      emitEvent: false,
    });
  }

  salvar() {
    if (this.form.disabled || this.salvando || this.carregandoClientes) return;
    this.normalizarPlaca();
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.salvando = true;
    this.erro = null;
    const dados = this.form.getRawValue();
    const corpo = {
      clienteId: String(dados.clienteId), modelo: dados.modelo, cor: dados.cor,
      ano: Number(dados.ano), defeitoRelatado: dados.defeitoRelatado,
      imagemUrl: dados.imagemUrl?.trim() || '',
    };

    const requisicao = this.idVeiculo
      ? this.veiculosService.atualizar(this.idVeiculo, corpo)
      : this.veiculosService.criar({ ...corpo, placa: dados.placa, status: 'Na Fila' });

    requisicao.subscribe({
      next: () => { this.salvando = false; void this.router.navigate(['/painel/veiculos']); },
      error: (erro: Error) => { this.salvando = false; this.erro = erro.message; },
    });
  }
}
