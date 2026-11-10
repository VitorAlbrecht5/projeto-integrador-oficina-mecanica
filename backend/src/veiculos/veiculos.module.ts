import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Veiculo, VeiculoSchema } from './schemas/veiculo.schema';
import { Cliente, ClienteSchema } from '../clientes/schemas/cliente.schema';
import { OrdemServico, OrdemServicoSchema } from '../ordens-servico/ordem-servico.schema';
import { Servico, ServicoSchema } from '../servicos/servico.schema';
import { VeiculosService } from './veiculos.service';
import { VeiculosController } from './veiculos.controller';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Veiculo.name, schema: VeiculoSchema },
    { name: Cliente.name, schema: ClienteSchema },
    { name: OrdemServico.name, schema: OrdemServicoSchema },
    { name: Servico.name, schema: ServicoSchema },
  ])],
  providers: [VeiculosService],
  exports: [VeiculosService],
  controllers: [VeiculosController],
})
export class VeiculosModule {}
