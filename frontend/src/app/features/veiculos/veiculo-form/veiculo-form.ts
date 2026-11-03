
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
  clientes: Cliente[] = [];

  idVeiculo: string | null = null;

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
      placa: ['', Validators.required],
      clienteId: [null, Validators.required],
      modelo: ['', Validators.required],
      cor: ['', Validators.required],
      ano: [
        '',
        [
          Validators.required,
          Validators.min(1950),
          Validators.max(2026),
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
        });

        // A placa é a identificação do veículo e não pode ser alterada.
        this.form.get('placa')?.disable();

        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar veículo:', erro);
        this.erro = 'Não foi possível carregar o veículo para edição.';
        this.carregando = false;
      },
    });
  }

  salvar() {
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
      }).subscribe({
        next: () => {
          this.salvando = false;
          this.router.navigate(['/painel/veiculos']);
        },
        error: (erro) => {
          console.error('Erro ao atualizar veículo:', erro);
          this.erro = 'Não foi possível atualizar o veículo.';
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
      status: 'Na Fila',
        }).subscribe({
      next: () => {
        this.salvando = false;
        this.router.navigate(['/painel/veiculos']);
      },
      error: (erro) => {
        console.error('Erro ao cadastrar veículo:', erro);
        this.erro = 'Não foi possível cadastrar o veículo.';
        this.salvando = false;
      },
    });
  }
}
