import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicosModule } from './servicos/servicos.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { VeiculosModule } from './veiculos/veiculos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot('mongodb://localhost:27017/oficina'),
    ServicosModule,
    VeiculosModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
