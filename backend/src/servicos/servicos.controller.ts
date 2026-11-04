import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ServicosService } from './servicos.service';
import { CriarServicoDto } from './dto/criar-servico.dto';
import { AtualizarServicoDto } from './dto/atualizar-servico.dto';
import { Perfis } from '../auth/decorators/perfis.decorator'; // Ajuste o caminho conforme o seu projeto

@Controller('servicos')
export class ServicosController {
  constructor(private readonly servicosService: ServicosService) {}

  @Post()
  @Perfis('admin', 'atendente')
  @HttpCode(HttpStatus.CREATED)
  async criar(@Body() dto: CriarServicoDto) {
    return this.servicosService.criar(dto);
  }

  @Get()
  async listarTodos() {
    return this.servicosService.listarTodos();
  }

  @Get(':id')
  async buscarPorId(@Param('id') id: string) {
    return this.servicosService.buscarPorId(id);
  }

  @Put(':id')
  @Perfis('admin', 'atendente')
  async atualizar(@Param('id') id: string, @Body() dto: AtualizarServicoDto) {
    return this.servicosService.atualizar(id, dto);
  }

  @Delete(':id')
  @Perfis('admin') // Apenas administradores podem excluir serviços[cite: 13]
  @HttpCode(HttpStatus.NO_CONTENT)
  async remover(@Param('id') id: string) {
    return this.servicosService.remover(id);
  }
}