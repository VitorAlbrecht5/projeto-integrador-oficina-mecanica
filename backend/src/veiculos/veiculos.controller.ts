import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VeiculosService } from './veiculos.service';
import { CriarVeiculoDto } from './dto/criar-veiculo.dto';
import { AtualizarVeiculoDto } from './dto/atualizar-veiculo.dto';
import { Perfis } from '../auth/decorators/perfis.decorator';
import { Publico } from '../auth/decorators/publico.decorator';

@ApiTags('Veículos')
@ApiBearerAuth()
@Perfis('admin')
@Controller('veiculos')
export class VeiculosController {
  constructor(private readonly veiculosService: VeiculosService) {}

  @Get()
  listar(@Query('placa') placa?: string) { return this.veiculosService.listar(placa); }

  @Publico()
  @Get('consulta/:placa')
  @ApiOperation({ summary: 'Consulta pública do andamento por placa, sem login' })
  consultar(@Param('placa') placa: string) {
    return this.veiculosService.consultarPorPlaca(placa);
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) { return this.veiculosService.buscarPorId(id); }

  @Post()
  criar(@Body() dados: CriarVeiculoDto) { return this.veiculosService.criar(dados); }

  @Patch(':id/reativar')
  @ApiOperation({ summary: 'Reativa um veículo que foi desativado' })
  reativar(@Param('id') id: string) { return this.veiculosService.reativar(id); }

  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() dados: AtualizarVeiculoDto) {
    return this.veiculosService.atualizar(id, dados);
  }

  @Delete(':id')
  remover(@Param('id') id: string) { return this.veiculosService.remover(id); }
}
