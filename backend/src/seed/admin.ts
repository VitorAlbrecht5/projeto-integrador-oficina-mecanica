import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { isEmail } from 'class-validator';
import { AppModule } from '../app.module';
import { Admin, type AdminDocument } from '../auth/schemas/admin.schema';

export async function criarAdmin(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const senha = process.env.ADMIN_SENHA;

  if (!email || !isEmail(email) || !senha || senha.length < 6) {
    throw new Error(
      'Preencha ADMIN_EMAIL e ADMIN_SENHA no .env. A senha deve ter pelo menos 6 caracteres.',
    );
  }

  if (Buffer.byteLength(senha, 'utf8') > 72) {
    throw new Error('A senha é longa demais. Escolha uma senha menor.');
  }

  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const adminModel = app.get<Model<AdminDocument>>(getModelToken(Admin.name));

    const existente = await adminModel.findOne({ email }).exec();

    if (existente) {
      console.log('Este administrador já existe. A senha foi mantida.');
      return;
    }

    const senhaCriptografada = await bcrypt.hash(senha, 12);

    await adminModel.create({
      email,
      senha: senhaCriptografada,
    });

    console.log('Administrador criado com sucesso!');
  } finally {
    await app.close();
  }
}

if (require.main === module) {
  void criarAdmin().catch((erro: unknown) => {
    console.error(
      erro instanceof Error
        ? erro.message
        : 'Não foi possível criar o administrador.',
    );

    process.exitCode = 1;
  });
}
