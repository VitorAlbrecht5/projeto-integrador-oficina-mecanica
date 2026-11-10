import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Perfis } from '../auth/decorators/perfis.decorator';
import { ClientesService } from './clientes.service';
import { CriarClienteDto } from './dto/criar-cliente.dto';
import { AtualizarClienteDto } from './dto/atualizar-cliente.dto';

@ApiTags('Clientes')
@ApiBearerAuth()
@Perfis('admin')
@ApiResponse({ status: 401, description: 'Token ausente ou inválido' })
@ApiResponse({ status: 403, description: 'Acesso restrito ao administrador' })
@Controller('clientes')
export class ClientesController {
  constructor(private readonly service: ClientesService) {}

  @ApiOperation({ summary: 'Lista os clientes ativos' })
  @ApiResponse({ status: 200, description: 'Clientes encontrados' })
  @Get()
  listar() {
    return this.service.listar();
  }

  @ApiOperation({ summary: 'Busca cliente ativo pelo ID' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.service.buscarPorId(id);
  }

  @ApiOperation({ summary: 'Cadastra um cliente' })
  @ApiResponse({ status: 201, description: 'Cliente criado' })
  @ApiResponse({ status: 409, description: 'CPF já cadastrado' })
  @Post()
  criar(@Body() dados: CriarClienteDto) {
    return this.service.criar(dados);
  }

  @ApiOperation({ summary: 'Atualiza os dados do cliente' })
  @ApiResponse({ status: 200, description: 'Cliente atualizado' })
  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() dados: AtualizarClienteDto) {
    return this.service.atualizar(id, dados);
  }

  @ApiOperation({ summary: 'Desativa o cliente sem apagar o cadastro' })
  @ApiResponse({ status: 200, description: 'Cliente desativado' })
  @Delete(':id')
  desativar(@Param('id') id: string) {
    return this.service.desativar(id);
  }
}
