import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServicoDocument = Servico & Document;

@Schema({ timestamps: true })
export class Servico {
  @Prop({ required: true, trim: true })
  nome: string;

  @Prop({ required: true })
  descricao: string;

  @Prop({ 
    required: true, 
    min: [0, 'O preço do serviço não pode ser negativo.'] 
  })
  preco: number;

  @Prop({ required: true })
  tempoEstimado: string;
}

export const ServicoSchema = SchemaFactory.createForClass(Servico);
ServicoSchema.index({ nome: 1 });