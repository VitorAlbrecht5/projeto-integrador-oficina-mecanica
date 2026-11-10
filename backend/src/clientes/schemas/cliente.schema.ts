import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
export class Endereco {
  @Prop({ required: true, trim: true }) cep!: string;
  @Prop({ required: true, trim: true }) rua!: string;
  @Prop({ required: true, trim: true }) numero!: string;
  @Prop({ trim: true }) complemento?: string;
  @Prop({ required: true, trim: true }) bairro!: string;
  @Prop({ required: true, trim: true }) cidade!: string;
  @Prop({ required: true, trim: true, uppercase: true }) estado!: string;
}
export const EnderecoSchema = SchemaFactory.createForClass(Endereco);

export type ClienteDocument = HydratedDocument<Cliente>;

@Schema({ timestamps: true, collection: 'clientes' })
export class Cliente {
  @Prop({ required: true, trim: true }) nomeCompleto!: string;
  @Prop({ required: true, unique: true, trim: true }) cpf!: string;
  @Prop({ required: true, trim: true }) telefone!: string;
  @Prop({ trim: true, lowercase: true }) email?: string;
  @Prop({ type: EnderecoSchema, required: true }) endereco!: Endereco;
  @Prop({ trim: true }) observacoes?: string;
  @Prop({ default: true }) ativo!: boolean;
}
export const ClienteSchema = SchemaFactory.createForClass(Cliente);
