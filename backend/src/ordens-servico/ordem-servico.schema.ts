import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export const STATUS_ORDEM = [
  'Na Fila',
  'Em Conserto',
  'Aguardando Peça',
  'Pronto',
] as const;
export type StatusOrdem = (typeof STATUS_ORDEM)[number];

@Schema({ timestamps: true })
export class OrdemServico {
  @Prop({ type: Types.ObjectId, ref: 'Veiculo', required: true, index: true })
  veiculoId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Cliente', required: true })
  clienteId!: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 500 })
  descricaoProblema!: string;

  @Prop({ type: String, enum: STATUS_ORDEM, default: 'Na Fila', index: true })
  status!: StatusOrdem;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Servico' }], default: [] })
  servicosIds!: Types.ObjectId[];

  @Prop({ default: Date.now })
  dataEntrada!: Date;
}

export const OrdemServicoSchema = SchemaFactory.createForClass(OrdemServico);
OrdemServicoSchema.index({ veiculoId: 1, status: 1 });
