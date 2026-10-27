import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ServicoService } from '../servico.service';

@Component({
  selector: 'app-servico-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './servico-form.html',
  styleUrls: ['./servico-form.css']
})
export class ServicoForm {
  private fb = inject(FormBuilder);
  private service = inject(ServicoService);
  private router = inject(Router);

  form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    descricao: ['', [Validators.required, Validators.minLength(5)]],
    preco: [0, [Validators.required, Validators.min(0.01)]],
    tempoEstimado: ['', [Validators.required]]
  });

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value;
    await this.service.criar({
      nome: val.nome!,
      descricao: val.descricao!,
      preco: Number(val.preco),
      tempoEstimado: val.tempoEstimado!
    }); 

    this.router.navigate(['/painel/servicos']);
  }
}