import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OrdemServico,
  OrdemServicoSchema,
} from '../ordens-servico/ordem-servico.schema';
import { RelatoriosController } from './relatorios.controller';
import { RelatoriosService } from './relatorios.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrdemServico.name, schema: OrdemServicoSchema },
    ]),
  ],
  controllers: [RelatoriosController],
  providers: [RelatoriosService],
})
export class RelatoriosModule {}
