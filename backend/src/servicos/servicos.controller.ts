/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ServicosService } from './servicos.service';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CriarServicoDto } from './criar-servico.dto';
import { AtualizarServicoDto } from './atualizar-servico.dto';
import { Perfis } from '../auth/decorators/perfis.decorator';

@ApiBearerAuth()
@Perfis('admin')
@ApiTags('Serviços')
@ApiResponse({ status: 401, description: 'Token ausente ou inválido' })
@ApiResponse({ status: 403, description: 'Acesso restrito ao administrador' })
@Controller('servicos')
export class ServicosController {
  constructor(private readonly servicosService: ServicosService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastra um serviço no catálogo' })
  @ApiResponse({ status: 201, description: 'Serviço criado' })
  @ApiResponse({ status: 400, description: 'Campos inválidos' })
  @HttpCode(HttpStatus.CREATED)
  async criar(@Body() dados: CriarServicoDto) {
    return this.servicosService.criar(dados);
  }

  @Get()
  @ApiOperation({ summary: 'Lista serviços e valores cadastrados' })
  @ApiResponse({ status: 200, description: 'Lista de serviços' })
  async listarTodos() {
    return this.servicosService.listarTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca serviço pelo ID' })
  @ApiResponse({ status: 404, description: 'Serviço não encontrado' })
  async buscarPorId(@Param('id') id: string) {
    return this.servicosService.buscarPorId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza o serviço (mantém PUT usado pelo Angular)' })
  @ApiResponse({ status: 200, description: 'Serviço atualizado' })
  async atualizar(@Param('id') id: string, @Body() dados: AtualizarServicoDto) {
    return this.servicosService.atualizar(id, dados);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui serviço do catálogo (exclusão definitiva: limitação conhecida)' })
  @ApiResponse({ status: 204, description: 'Serviço removido' })
  @ApiResponse({ status: 404, description: 'Serviço não encontrado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remover(@Param('id') id: string) {
    return this.servicosService.remover(id);
  }
}
