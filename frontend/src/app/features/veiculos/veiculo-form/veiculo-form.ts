
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterModule,
  Router,
  ActivatedRoute
} from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

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
  private formBuilder = inject(FormBuilder);
  private veiculosService = inject(VeiculosService);
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form!: FormGroup;
  salvando = false;
  carregando = false;
  erro: string | null = null;
  erroImagem: boolean = false;
  clientes: Cliente[] = [];
  idVeiculo: string | null = null;

  readonly anoMinimo = 1950;
  readonly anoMaximo = new Date().getFullYear() + 1;

  get modoEdicao(): boolean {
    return this.idVeiculo !== null;
  }

  ngOnInit() {
    this.clientes = this.clienteService.obterClientes();

    this.iniciarFormulario();

    this.idVeiculo = this.route.snapshot.paramMap.get('id');

    if (this.modoEdicao) {
      this.carregarVeiculo();
    }
  }

  iniciarFormulario() {
    this.form = this.formBuilder.group({
      placa: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/i),
        ],
      ],

      clienteId: [null, Validators.required],
      modelo: ['', Validators.required],
      cor: ['', Validators.required],
      ano: [
        '',
        [
          Validators.required,
          Validators.min(this.anoMinimo),
          Validators.max(this.anoMaximo),
        ],
      ],
      defeitoRelatado: ['', Validators.required],
      imagemUrl: [''],
    });
  }

  carregarVeiculo() {
    if (!this.idVeiculo) return;

    this.carregando = true;
    this.erro = null;

    this.veiculosService.buscarPorId(this.idVeiculo).subscribe({
      next: (veiculo) => {
        this.form.patchValue({
          placa: veiculo.placa,
          clienteId: veiculo.clienteId,
          modelo: veiculo.modelo,
          cor: veiculo.cor,
          ano: veiculo.ano,
          defeitoRelatado: veiculo.defeitoRelatado,
          imagemUrl: veiculo.imagemUrl ?? '',
        });


        // A placa é a identificação do veículo e não pode ser alterada.
        this.form.get('placa')?.disable();

        if (!veiculo.ativo) {
          this.form.disable();

          this.erro =
            'Este veículo está desativado. Ative-o na lista antes de editar.';
        }


        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar veículo:', erro);
        this.erro = 'Não foi possível carregar o veículo para edição.';
        this.carregando = false;
      },
    });
  }

  normalizarPlaca(): void {
    const campo = this.form.get('placa');

    if (!campo || campo.disabled) return;

    const placa = String(campo.value ?? '')
      .trim()
      .replace(/-/g, '')
      .toUpperCase();

    campo.setValue(placa, { emitEvent: false });
  }



  salvar() {
    if (this.form.disabled) return;
    this.normalizarPlaca();
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    this.erro = null;

    // getRawValue() inclui a placa mesmo estando desabilitada.
    const dados = this.form.getRawValue();

    if (this.idVeiculo) {
      this.veiculosService.atualizar(this.idVeiculo, {
        clienteId: dados.clienteId,
        modelo: dados.modelo,
        cor: dados.cor,
        ano: Number(dados.ano),
        defeitoRelatado: dados.defeitoRelatado,
        imagemUrl: dados.imagemUrl?.trim() || '',
      }).subscribe({
        next: () => {
          this.salvando = false;
          this.router.navigate(['/painel/veiculos']);
        },
        error: (erro) => {
          console.error('Erro ao atualizar veículo:', erro);
          this.erro = erro instanceof Error
            ? erro.message
            : 'Não foi possível atualizar o veículo.';

          this.salvando = false;
        },
      });

      return;
    }

    this.veiculosService.criar({
      placa: dados.placa,
      clienteId: dados.clienteId,
      modelo: dados.modelo,
      cor: dados.cor,
      ano: Number(dados.ano),
      defeitoRelatado: dados.defeitoRelatado,
      imagemUrl: dados.imagemUrl?.trim() || '',
      status: 'Veículo recebido - Aguardando Avaliação',
    }).subscribe({
      next: () => {
        this.salvando = false;
        this.router.navigate(['/painel/veiculos']);
      },
      error: (erro) => {
        console.error('Erro ao cadastrar veículo:', erro);
        this.erro = erro instanceof Error
          ? erro.message
          : 'Não foi possível cadastrar o veículo.';

        this.salvando = false;
      },
    });
  }
}
