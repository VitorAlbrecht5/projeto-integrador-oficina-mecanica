import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type Perfil = 'admin' | 'atendente';
export type UsuarioDocument = HydratedDocument<Usuario>;

@Schema({ timestamps: true, collection: 'admins' })
export class Usuario {
  @Prop({ default: 'Administrador', trim: true })
  nome!: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  email!: string;

  @Prop({
    type: String,
    enum: ['admin', 'atendente'],
    default: 'admin',
  })
  perfil!: Perfil;

  @Prop({ select: false })
  senhaHash?: string;

  // Compatibilidade com o hash das contas criadas anteriormente.
  @Prop({ select: false })
  senha?: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
