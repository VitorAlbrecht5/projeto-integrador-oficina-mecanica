import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CriarServicoDto {
  @IsString({ message: 'O nome deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome do serviço é obrigatório.' })
  nome: string;

  @IsString({ message: 'A descrição deve ser um texto.' })
  @IsNotEmpty({ message: 'A descrição é obrigatória.' })
  descricao: string;

  @IsNumber({}, { message: 'O preço deve ser um número.' })
  @Min(0, { message: 'O preço do serviço não pode ser negativo.' })
  preco: number;

  @IsString({ message: 'O tempo estimado deve ser um texto.' })
  @IsNotEmpty({ message: 'O tempo estimado é obrigatório.' })
  tempoEstimado: string;
}
