import { PartialType } from '@nestjs/swagger';
import { CriarVeiculoDto } from './criar-veiculo.dto';

export class AtualizarVeiculoDto extends PartialType(CriarVeiculoDto) {}
