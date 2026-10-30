import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicosModule } from './servicos/servicos.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/oficina'), // Ajuste a URL do seu MongoDB
    ServicosModule
  ],
})
export class AppModule {}