import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { STATUS_VEICULO } from '../schemas/veiculo.schema';
import type { StatusVeiculo } from '../schemas/veiculo.schema';

export class CriarVeiculoDto {
  @ApiProperty({ example: 'ABC-1234', description: 'Placa do veículo' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{3}-[0-9]{4}$|^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/, {
    message: 'Informe uma placa válida.',
  })
  placa!: string;

  @ApiProperty({ example: 'Honda Civic' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(40)
  modelo!: string;

  @ApiProperty({ example: 'Preto' })
  @IsString()
  @IsNotEmpty()
  cor!: string;

  @ApiProperty({ example: 2020 })
  @Type(() => Number)
  @IsInt()
  @Min(1950)
  @Max(2100)
  ano!: number;

  @ApiProperty({ example: 'Problema no motor' })
  @IsString()
  @IsNotEmpty()
  defeitoRelatado!: string;

  @ApiPropertyOptional({
    enum: STATUS_VEICULO,
    example: 'Na Fila',
  })
  @IsOptional()
  @IsEnum(STATUS_VEICULO)
  status?: StatusVeiculo;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  clienteId!: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiPropertyOptional({ example: 'https://exemplo.com/carro.jpg' })
  @IsOptional()
  @IsString()
  imagemUrl?: string;
}
