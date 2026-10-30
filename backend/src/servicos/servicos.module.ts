import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Servico, ServicoSchema } from './servico.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Servico.name, schema: ServicoSchema }])
  ],
  exports: [MongooseModule]
})
export class ServicosModule {}