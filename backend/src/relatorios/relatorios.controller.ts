import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Perfis } from '../auth/decorators/perfis.decorator';
import { RelatoriosService, type PeriodoRelatorio } from './relatorios.service';

@ApiTags('Relatórios')
@ApiBearerAuth()
@Perfis('admin')
@ApiResponse({ status: 401, description: 'Token ausente ou inválido' })
@ApiResponse({ status: 403, description: 'Acesso restrito ao administrador' })
@Controller('relatorios')
export class RelatoriosController {
  constructor(private readonly relatorios: RelatoriosService) {}

  @Get('resumo')
  @ApiQuery({ name: 'periodo', required: false, enum: ['dia', 'mes', 'ano'] })
  @ApiResponse({
    status: 200,
    description:
      'Totais e série histórica de finalizações calculados do MongoDB',
  })
  @ApiResponse({ status: 400, description: 'Período inválido' })
  @ApiOperation({
    summary: 'Resumo das ordens de serviço e histórico real de finalizações',
  })
  resumo(@Query('periodo') periodo = 'mes') {
    if (!['dia', 'mes', 'ano'].includes(periodo)) {
      throw new BadRequestException('Período inválido. Use dia, mes ou ano.');
    }
    return this.relatorios.obterResumo(periodo as PeriodoRelatorio);
  }
}
