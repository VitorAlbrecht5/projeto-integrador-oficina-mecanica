import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';

const textoOpcional = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() || undefined : value;

export class EnderecoDto {
  @ApiProperty({ example: '93210-100' })
  @IsString()
  @Matches(/^\d{5}-?\d{3}$/, { message: 'Informe um CEP válido.' })
  cep!: string;

  @ApiProperty({ example: 'Rua das Flores' })
  @IsString() @IsNotEmpty() rua!: string;

  @ApiProperty({ example: '150' })
  @IsString() @IsNotEmpty() numero!: string;

  @ApiPropertyOptional({ example: 'Casa 2' })
  @Transform(textoOpcional)
  @IsOptional() @IsString() complemento?: string;

  @ApiProperty({ example: 'Centro' })
  @IsString() @IsNotEmpty() bairro!: string;

  @ApiProperty({ example: 'Esteio' })
  @IsString() @IsNotEmpty() cidade!: string;

  @ApiProperty({ example: 'RS' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString() @Matches(/^[A-Z]{2}$/, { message: 'Informe a UF com 2 letras.' })
  estado!: string;
}

export class CriarClienteDto {
  @ApiProperty({ example: 'Mariana de Souza' })
  @IsString() @MinLength(3) nomeCompleto!: string;

  @ApiProperty({ example: '123.456.789-09' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.replace(/\D/g, '') : value,
  )
  @IsString() @Matches(/^\d{11}$/, { message: 'CPF deve conter 11 dígitos.' })
  cpf!: string;

  @ApiProperty({ example: '(51) 99999-8888' })
  @IsString()
  @Matches(/^(?:\D*\d){10,11}\D*$/, {
    message: 'Telefone deve conter 10 ou 11 dígitos.',
  })
  telefone!: string;

  @ApiPropertyOptional({ example: 'mariana@email.com' })
  @Transform(textoOpcional)
  @IsOptional() @IsEmail() email?: string;

  @ApiProperty({ type: EnderecoDto })
  @ValidateNested() @Type(() => EnderecoDto)
  endereco!: EnderecoDto;

  @ApiPropertyOptional({ example: 'Prefere WhatsApp' })
  @Transform(textoOpcional)
  @IsOptional() @IsString() observacoes?: string;
}
