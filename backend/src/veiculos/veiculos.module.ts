import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Veiculo, VeiculoSchema } from './schemas/veiculo.schema';
import { VeiculosService } from './veiculos.service';
import { VeiculosController } from './veiculos.controller';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Veiculo.name, schema: VeiculoSchema }]),
  ],
  providers: [VeiculosService],
  exports: [VeiculosService],
  controllers: [VeiculosController],
})
export class VeiculosModule {}
