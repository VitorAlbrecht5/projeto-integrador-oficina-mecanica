import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Perfis } from '../auth/decorators/perfis.decorator';
import { ClientesService } from './clientes.service';
import { CriarClienteDto } from './dto/criar-cliente.dto';
import { AtualizarClienteDto } from './dto/atualizar-cliente.dto';

@ApiTags('Clientes')
@ApiBearerAuth()
@Perfis('admin')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly service: ClientesService) {}

  @Get()
  listar() { return this.service.listar(); }

  @Get(':id')
  buscar(@Param('id') id: string) { return this.service.buscarPorId(id); }

  @Post()
  criar(@Body() dados: CriarClienteDto) { return this.service.criar(dados); }

  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() dados: AtualizarClienteDto) {
    return this.service.atualizar(id, dados);
  }

  @Delete(':id')
  desativar(@Param('id') id: string) { return this.service.desativar(id); }
}
