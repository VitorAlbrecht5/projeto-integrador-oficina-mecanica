import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdemServico, OrdemServicoSchema } from './ordem-servico.schema';
import { Veiculo, VeiculoSchema } from '../veiculos/schemas/veiculo.schema';
import { Servico, ServicoSchema } from '../servicos/servico.schema';
import { OrdensServicoService } from './ordens-servico.service';
import { OrdensServicoController } from './ordens-servico.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrdemServico.name, schema: OrdemServicoSchema },
      { name: Veiculo.name, schema: VeiculoSchema },
      { name: Servico.name, schema: ServicoSchema },
    ]),
  ],
  controllers: [OrdensServicoController],
  providers: [OrdensServicoService],
})
export class OrdensServicoModule {}
