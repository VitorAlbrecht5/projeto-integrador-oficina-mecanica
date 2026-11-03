import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Estados permitidos para os veículos
export const STATUS_VEICULO = [
  'Na Fila',
  'Em Conserto',
  'Aguardando Peça',
  'Pronto',
] as const;

export type StatusVeiculo = (typeof STATUS_VEICULO)[number];

export type VeiculoDocument = HydratedDocument<Veiculo>;

@Schema({ timestamps: true, collection: 'veiculos' })
export class Veiculo {
  @Prop({
    required: true,
    trim: true,
    uppercase: true,
    minlength: 7,
    maxlength: 8,
    match: /^[A-Z]{3}-[0-9]{4}$|^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/,
  })
  placa!: string;

  @Prop({
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 40,
  })
  modelo!: string;

  @Prop({
    required: true,
    trim: true,
  })
  cor!: string;

  @Prop({
    required: true,
    min: 1950,
    max: 2100,
    validate: {
      validator: Number.isInteger,
      message: 'O ano deve ser um número inteiro.',
    },
  })
  ano!: number;

  @Prop({ required: true, trim: true })
  defeitoRelatado!: string;

  @Prop({
    type: String,
    enum: STATUS_VEICULO,
    default: 'Na Fila',
  })
  status!: StatusVeiculo;

  @Prop({ required: true })
  clienteId!: number;

  @Prop({ default: true })
  ativo!: boolean;

  @Prop({ trim: true })
  imagemUrl?: string;
}

export const VeiculoSchema = SchemaFactory.createForClass(Veiculo);

// Impede placas duplicadas
VeiculoSchema.index({ placa: 1 }, { unique: true });
