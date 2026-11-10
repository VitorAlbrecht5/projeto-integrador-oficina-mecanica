import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Perfis } from '../auth/decorators/perfis.decorator';
import { OrdensServicoService } from './ordens-servico.service';
import { CriarOrdemServicoDto } from './dto/criar-ordem-servico.dto';
import { AtualizarOrdemServicoDto } from './dto/atualizar-ordem-servico.dto';

@ApiTags('Ordens de Serviço')
@ApiBearerAuth()
@Perfis('admin')
@ApiResponse({ status: 401, description: 'Token ausente ou inválido' })
@ApiResponse({ status: 403, description: 'Acesso restrito ao administrador' })
@Controller('ordens-servico')
export class OrdensServicoController {
  constructor(private readonly service: OrdensServicoService) {}

  @Get()
  @ApiOperation({ summary: 'Lista ordens cadastradas' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Na Fila, Em Conserto, Aguardando Peça ou Pronto',
  })
  @ApiResponse({ status: 200, description: 'Lista de atendimentos' })
  listar(@Query('status') status?: string) {
    return this.service.listar(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulta uma ordem pelo ID' })
  @ApiResponse({ status: 404, description: 'Ordem não encontrada' })
  obter(@Param('id') id: string) {
    return this.service.obterPorId(id);
  }

  @Post()
  @ApiOperation({ summary: 'Inicia atendimento para veículo ativo' })
  @ApiResponse({ status: 201, description: 'Atendimento aberto' })
  @ApiResponse({
    status: 409,
    description: 'Já existe um atendimento em andamento para o veículo',
  })
  criar(@Body() dados: CriarOrdemServicoDto) {
    return this.service.criar(dados);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualiza atendimento e sincroniza o status do veículo',
  })
  @ApiResponse({ status: 200, description: 'Atendimento atualizado' })
  @ApiResponse({ status: 400, description: 'Transição ou dados inválidos' })
  atualizar(@Param('id') id: string, @Body() dados: AtualizarOrdemServicoDto) {
    return this.service.atualizar(id, dados);
  }
}
