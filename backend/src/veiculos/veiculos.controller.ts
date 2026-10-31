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
import { VeiculosService } from './veiculos.service';
import { CriarVeiculoDto } from './dto/criar-veiculo.dto';
import { AtualizarVeiculoDto } from './dto/atualizar-veiculo.dto';

@Controller('veiculos')
export class VeiculosController {
  constructor(private readonly veiculosService: VeiculosService) {}

  @Get()
  listar(@Query('placa') placa?: string) {
    return this.veiculosService.listar(placa);
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.veiculosService.buscarPorId(id);
  }

  @Post()
  criar(@Body() dados: CriarVeiculoDto) {
    return this.veiculosService.criar(dados);
  }

  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() dados: AtualizarVeiculoDto) {
    return this.veiculosService.atualizar(id, dados);
  }

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.veiculosService.remover(id);
  }
}
