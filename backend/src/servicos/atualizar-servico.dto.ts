import { PartialType } from '@nestjs/swagger';
import { CriarServicoDto } from './criar-servico.dto';

export class AtualizarServicoDto extends PartialType(CriarServicoDto) {}
