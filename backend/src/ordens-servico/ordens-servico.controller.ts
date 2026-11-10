import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Perfis } from '../auth/decorators/perfis.decorator';
import { OrdensServicoService } from './ordens-servico.service';
import { CriarOrdemServicoDto } from './dto/criar-ordem-servico.dto';
import { AtualizarOrdemServicoDto } from './dto/atualizar-ordem-servico.dto';

@ApiTags('Ordens de Serviço')
@ApiBearerAuth()
@Perfis('admin')
@Controller('ordens-servico')
export class OrdensServicoController {
  constructor(private readonly service: OrdensServicoService) {}

  @Get()
  @ApiOperation({ summary: 'Lista ordens cadastradas' })
  listar(@Query('status') status?: string) { return this.service.listar(status); }

  @Get(':id')
  @ApiOperation({ summary: 'Consulta uma ordem pelo ID' })
  obter(@Param('id') id: string) { return this.service.obterPorId(id); }

  @Post()
  @ApiOperation({ summary: 'Cria uma OS para veículo ativo' })
  criar(@Body() dados: CriarOrdemServicoDto) { return this.service.criar(dados); }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza OS e sincroniza o andamento do veículo' })
  atualizar(@Param('id') id: string, @Body() dados: AtualizarOrdemServicoDto) {
    return this.service.atualizar(id, dados);
  }
}
