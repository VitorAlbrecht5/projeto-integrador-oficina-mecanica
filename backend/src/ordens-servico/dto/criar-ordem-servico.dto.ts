import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
export class CriarOrdemServicoDto {
  @ApiProperty({ example: '690c093c36d7bdaaf0592711' })
  @IsMongoId()
  veiculoId!: string;

  @ApiProperty({ example: 'Verificar barulho no motor ao acelerar' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  descricaoProblema!: string;

  @ApiPropertyOptional({ type: [String], example: [] })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  servicosIds?: string[];
}
