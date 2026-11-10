import { Transform, Type } from 'class-transformer';
import {
  IsBoolean, IsIn, IsInt, IsMongoId, IsNotEmpty,
  IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { normalizarPlaca } from '../normalizar-placa';
import { normalizarStatusVeiculo } from '../normalizar-status';
import { STATUS_VEICULO, type StatusVeiculo } from '../schemas/veiculo.schema';

export class CriarVeiculoDto {
  @ApiProperty({ example: 'ABC1234', description: 'Placa normalizada (7 caracteres)' })
  @Transform(({ value }: { value: unknown }) => normalizarPlaca(value))
  @IsString() @IsNotEmpty()
  @Matches(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/, {
    message: 'Informe uma placa válida.',
  })
  placa!: string;

  @ApiProperty({ example: 'Honda Civic' })
  @IsString() @IsNotEmpty() @MinLength(1) @MaxLength(40)
  modelo!: string;

  @ApiProperty({ example: 'Preto' })
  @IsString() @IsNotEmpty()
  cor!: string;

  @ApiProperty({ example: 2020 })
  @Type(() => Number) @IsInt() @Min(1950) @Max(2100)
  ano!: number;

  @ApiProperty({ example: 'Problema no motor' })
  @IsString() @IsNotEmpty()
  defeitoRelatado!: string;

  @ApiPropertyOptional({ enum: STATUS_VEICULO, example: 'Na Fila' })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => normalizarStatusVeiculo(value))
  @IsIn(STATUS_VEICULO, { message: 'Informe um status válido.' })
  status?: StatusVeiculo;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'ID MongoDB de cliente ativo' })
  @IsMongoId({ message: 'Selecione um cliente válido.' })
  clienteId!: string;

  @ApiPropertyOptional({ example: 'https://exemplo.com/carro.jpg' })
  @IsOptional() @IsString()
  imagemUrl?: string;
}
