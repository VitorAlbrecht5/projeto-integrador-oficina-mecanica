import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicosService } from '../servicos.service';
import { ServicoEntrada } from '../servicos.model';

@Component({
  selector: 'app-servicos-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './servicos-form.html',
  styleUrl: './servicos-form.css',
})
export class ServicoForm {
  private readonly service = inject(ServicosService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  erro: string | null = null;
  salvando = false;
  form: FormGroup = this.fb.group({
    nome: ['', Validators.required],
    descricao: ['', Validators.required],
    preco: [0, [Validators.required, Validators.min(0)]],
    tempoEstimado: ['', Validators.required],
  });
  onSubmit(): void {
    if (this.form.invalid || this.salvando) { this.form.markAllAsTouched(); return; }
    this.salvando = true;
    this.service.adicionarServico(this.form.getRawValue() as ServicoEntrada).subscribe({
      next: () => { this.salvando = false; this.router.navigate(['/painel/servicos']); },
      error: (e: Error) => { this.salvando = false; this.erro = e.message; },
    });
  }
}
