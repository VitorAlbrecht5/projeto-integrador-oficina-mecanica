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
import { ApiBearerAuth } from '@nestjs/swagger';
import { Perfis } from '../auth/decorators/perfis.decorator';

@ApiBearerAuth()
@Perfis('admin')
@Controller('servicos')
export class ServicosController {
  constructor(private readonly servicosService: ServicosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async criar(@Body() dados: Record<string, unknown>) {
    return this.servicosService.criar(dados);
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
  async atualizar(@Param('id') id: string, @Body() dados: Record<string, unknown>) {
    return this.servicosService.atualizar(id, dados);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remover(@Param('id') id: string) {
    return this.servicosService.remover(id);
  }
}
