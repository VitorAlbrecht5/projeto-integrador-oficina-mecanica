
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
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

  form!: FormGroup;
  salvando = false;
  clientes: Cliente[] = [];

  ngOnInit() {
    this.clientes = this.clienteService.obterClientes();
    this.iniciarFormulario();
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
    });
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    const dados = this.form.value;

    this.veiculosService.criar(dados).subscribe({
      next: () => {
        this.salvando = false;
        this.router.navigate(['/painel/veiculos']);
      },
      error: (erro) => {
        console.error('Erro ao salvar:', erro);
        this.salvando = false;
      },
    });
  }
}
