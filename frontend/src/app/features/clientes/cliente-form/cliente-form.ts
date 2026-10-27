import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ClienteService } from '../cliente.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cliente-form.html',
  styleUrls: ['./cliente-form.css']
})
export class ClienteForm implements OnInit {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  clienteForm!: FormGroup;
  modoEdicao = false;
  clienteId: number | null = null;

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
        estado: ['', [Validators.required]]
      }),
      observacoes: ['']
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.modoEdicao = true;
      this.clienteId = Number(idParam);
      const clienteEncontrado = this.clienteService.obterClientes().find(c => c.id === this.clienteId);
      if (clienteEncontrado) {
        this.clienteForm.patchValue(clienteEncontrado);
      }
    }
  }

  salvar() {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    const dadosCliente = this.clienteForm.value;

    if (this.modoEdicao && this.clienteId) {
      this.clienteService.atualizarCliente({ ...dadosCliente, id: this.clienteId });
    } else {
      this.clienteService.adicionarCliente(dadosCliente);
    }

    this.router.navigate(['/painel/clientes']);
  }
}