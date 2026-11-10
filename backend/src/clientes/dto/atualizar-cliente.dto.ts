import { PartialType } from '@nestjs/swagger';
import { CriarClienteDto } from './criar-cliente.dto';

export class AtualizarClienteDto extends PartialType(CriarClienteDto) {}
