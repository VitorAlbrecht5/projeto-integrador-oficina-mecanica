import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsIn, IsMongoId, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { STATUS_ORDEM, type StatusOrdem } from '../ordem-servico.schema';

export class AtualizarOrdemServicoDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  descricaoProblema?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  servicosIds?: string[];

  @ApiPropertyOptional({ enum: STATUS_ORDEM })
  @IsOptional()
  @IsIn([...STATUS_ORDEM])
  status?: StatusOrdem;
}
