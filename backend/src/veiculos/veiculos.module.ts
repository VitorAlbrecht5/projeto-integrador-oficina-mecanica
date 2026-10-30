import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Veiculo, VeiculoSchema } from './schemas/veiculo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Veiculo.name, schema: VeiculoSchema }]),
  ],
})
export class VeiculosModule {}
