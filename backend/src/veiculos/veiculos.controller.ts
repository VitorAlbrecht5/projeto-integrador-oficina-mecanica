import {
  Body,
  Controller,
  Delete,
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
import { VeiculosService } from './veiculos.service';
import { CriarVeiculoDto } from './dto/criar-veiculo.dto';
import { AtualizarVeiculoDto } from './dto/atualizar-veiculo.dto';
import { Perfis } from '../auth/decorators/perfis.decorator';
import { Publico } from '../auth/decorators/publico.decorator';

@ApiTags('Veículos')
@ApiBearerAuth()
@Perfis('admin')
@ApiResponse({
  status: 401,
  description: 'Token ausente ou inválido (exceto consulta pública)',
})
@ApiResponse({
  status: 403,
  description: 'Acesso restrito ao administrador (exceto consulta pública)',
})
@Controller('veiculos')
export class VeiculosController {
  constructor(private readonly veiculosService: VeiculosService) {}

  @ApiOperation({ summary: 'Lista veículos, com filtro opcional de placa' })
  @ApiQuery({
    name: 'placa',
    required: false,
    description: 'Placa com ou sem hífen',
  })
  @ApiResponse({ status: 200, description: 'Veículos encontrados' })
  @Get()
  listar(@Query('placa') placa?: string) {
    return this.veiculosService.listar(placa);
  }

  @Publico()
  @Get('consulta/:placa')
  @ApiOperation({
    summary: 'Consulta pública do andamento por placa, sem login',
  })
  @ApiResponse({
    status: 200,
    description:
      'Placa, modelo, status, observação da última OS e serviços, sem dados pessoais do cliente',
  })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado' })
  consultar(@Param('placa') placa: string) {
    return this.veiculosService.consultarPorPlaca(placa);
  }

  @ApiOperation({ summary: 'Busca veículo pelo ID' })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado' })
  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.veiculosService.buscarPorId(id);
  }

  @ApiOperation({ summary: 'Cadastra veículo vinculado a cliente ativo' })
  @ApiResponse({ status: 201, description: 'Veículo criado' })
  @ApiResponse({ status: 409, description: 'Placa duplicada' })
  @Post()
  criar(@Body() dados: CriarVeiculoDto) {
    return this.veiculosService.criar(dados);
  }

  @Patch(':id/reativar')
  @ApiOperation({ summary: 'Reativa um veículo que foi desativado' })
  @ApiResponse({ status: 200, description: 'Veículo reativado' })
  reativar(@Param('id') id: string) {
    return this.veiculosService.reativar(id);
  }

  @ApiOperation({ summary: 'Edita dados do veículo' })
  @ApiResponse({ status: 200, description: 'Veículo atualizado' })
  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() dados: AtualizarVeiculoDto) {
    return this.veiculosService.atualizar(id, dados);
  }

  @ApiOperation({ summary: 'Desativa veículo logicamente' })
  @ApiResponse({ status: 200, description: 'Veículo desativado' })
  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.veiculosService.remover(id);
  }
}
