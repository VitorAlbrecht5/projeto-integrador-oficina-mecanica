import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicosModule } from './servicos/servicos.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { VeiculosModule } from './veiculos/veiculos.module';
import { ClientesModule } from './clientes/clientes.module';
import { OrdensServicoModule } from './ordens-servico/ordens-servico.module';
import { RelatoriosModule } from './relatorios/relatorios.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/oficina',
    ),
    ServicosModule,
    VeiculosModule,
    AuthModule,
    ClientesModule,
    OrdensServicoModule,
    RelatoriosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
