import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CriarServicoDto {
  @ApiProperty({ example: 'Troca de óleo' })
  @IsString({ message: 'O nome deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome do serviço é obrigatório.' })
  nome: string;

  @ApiProperty({ example: 'Substituição de óleo e filtro' })
  @IsString({ message: 'A descrição deve ser um texto.' })
  @IsNotEmpty({ message: 'A descrição é obrigatória.' })
  descricao: string;

  @ApiProperty({ example: 120 })
  @IsNumber({}, { message: 'O preço deve ser um número.' })
  @Min(0, { message: 'O preço do serviço não pode ser negativo.' })
  preco: number;

  @ApiProperty({ example: '1 hora' })
  @IsString({ message: 'O tempo estimado deve ser um texto.' })
  @IsNotEmpty({ message: 'O tempo estimado é obrigatório.' })
  tempoEstimado: string;
}
