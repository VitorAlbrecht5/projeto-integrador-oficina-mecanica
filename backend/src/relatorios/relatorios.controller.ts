import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Perfis } from '../auth/decorators/perfis.decorator';
import { RelatoriosService, type PeriodoRelatorio } from './relatorios.service';

@ApiTags('Relatórios')
@ApiBearerAuth()
@Perfis('admin')
@Controller('relatorios')
export class RelatoriosController {
  constructor(private readonly relatorios: RelatoriosService) {}

  @Get('resumo')
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
