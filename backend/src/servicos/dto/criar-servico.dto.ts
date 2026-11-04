import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CriarServicoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsNumber()
  @IsPositive()
  preco: number;

  @IsString()
  @IsNotEmpty()
  tempoEstimado: string;
}