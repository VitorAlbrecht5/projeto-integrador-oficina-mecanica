import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ClienteService } from '../cliente.service';
import { ClienteEntrada } from '../cliente.model';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cliente-form.html',
  styleUrls: ['./cliente-form.css'],
})
export class ClienteForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly clienteService = inject(ClienteService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  clienteForm!: FormGroup;
  clienteId: string | null = null;
  carregando = false;
  salvando = false;
  erro: string | null = null;

  get modoEdicao(): boolean { return this.clienteId !== null; }

  ngOnInit() {
    this.clienteForm = this.fb.group({
      nomeCompleto: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/)]],
      telefone: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.email]],
      endereco: this.fb.group({
        cep: ['', [Validators.required]],
        rua: ['', [Validators.required]],
        numero: ['', [Validators.required]],
        complemento: [''],
        bairro: ['', [Validators.required]],
        cidade: ['', [Validators.required]],
        estado: ['', [Validators.required]],
      }),
      observacoes: [''],
    });

    this.clienteId = this.route.snapshot.paramMap.get('id');
    if (!this.clienteId) return;
    this.carregando = true;
    this.clienteService.buscarPorId(this.clienteId).subscribe({
      next: cliente => { this.clienteForm.patchValue(cliente); this.carregando = false; },
      error: (erro: Error) => { this.erro = erro.message; this.carregando = false; },
    });
  }

  salvar() {
    if (this.salvando || this.carregando) return;
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }
    this.salvando = true;
    this.erro = null;
    const dados = this.clienteForm.getRawValue() as ClienteEntrada;
    const operacao = this.clienteId
      ? this.clienteService.atualizarCliente(this.clienteId, dados)
      : this.clienteService.adicionarCliente(dados);
    operacao.subscribe({
      next: () => { this.salvando = false; void this.router.navigate(['/painel/cliente']); },
      error: (erro: Error) => { this.erro = erro.message; this.salvando = false; },
    });
  }

  formatarCampo(event: Event, campo: 'cpf' | 'telefone' | 'cep'): void {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, '');
    if (campo === 'cpf') {
      valor = valor.slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    if (campo === 'cep') {
      valor = valor.slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
    }
    if (campo === 'telefone') {
      valor = valor.slice(0, 11);
      const ddd = valor.slice(0, 2);
      const numero = valor.slice(2);
      if (valor.length > 2) {
        if (numero.length <= 4) valor = `(${ddd}) ${numero}`;
        else if (numero.length <= 8) valor = `(${ddd}) ${numero.slice(0, 4)}-${numero.slice(4)}`;
        else valor = `(${ddd}) ${numero.slice(0, 5)}-${numero.slice(5)}`;
      }
    }
    input.value = valor;
    this.clienteForm.get(campo)?.setValue(valor, { emitEvent: false });
  }
}
