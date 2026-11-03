import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicosService } from '../servicos.service';

@Component({
  selector: 'app-servicos-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './servicos-form.html',
  styleUrl: './servicos-form.css'
})
export class ServicoForm {
  private service = inject(ServicosService);
  private fb = inject(FormBuilder);
  
  // Alterado de 'servicoForm' para 'form' para corresponder ao HTML
  form: FormGroup = this.fb.group({
    nome: ['', Validators.required],
    descricao: ['', Validators.required],
    preco: [0, [Validators.required, Validators.min(0)]],
    tempoEstimado: ['', Validators.required]
  });

  // Alterado de 'salvar' para 'onSubmit' para corresponder ao HTML
  async onSubmit() {
    if (this.form.invalid) return;
    
    const dados = this.form.value as { nome: string; descricao: string; preco: number; tempoEstimado: string };
    
    try {
      this.service.adicionarServico(dados);
      alert('Serviço salvo com sucesso!');
      this.form.reset();
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
    }
  }
}