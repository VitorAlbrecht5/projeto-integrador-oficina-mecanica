import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

/** Resposta padronizada para todos os erros HTTP da API. */
export interface RespostaErro {
  sucesso: false;
  status: number;
  message: string | string[];
  caminho: string;
  dataHora: string;
}

@Catch()
export class ExcecoesFilter implements ExceptionFilter {
  private readonly logger = new Logger('Erros');

  catch(excecao: unknown, host: ArgumentsHost): void {
    const contexto = host.switchToHttp();
    const resposta = contexto.getResponse<Response>();
    const requisicao = contexto.getRequest<Request>();
    const status =
      excecao instanceof HttpException
        ? excecao.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Nunca expor stack traces ou mensagens internas em respostas HTTP 5xx.
    let mensagem: string | string[] =
      'Erro interno. Tente novamente mais tarde.';
    if (status < 500 && excecao instanceof HttpException) {
      const conteudo: unknown = excecao.getResponse();
      if (typeof conteudo === 'string') {
        mensagem = conteudo;
      } else if (
        conteudo &&
        typeof conteudo === 'object' &&
        'message' in conteudo
      ) {
        const valor: unknown = conteudo.message;
        if (
          typeof valor === 'string' ||
          (Array.isArray(valor) &&
            valor.every((item) => typeof item === 'string'))
        ) {
          mensagem = valor;
        } else {
          mensagem = excecao.message;
        }
      } else {
        mensagem = excecao.message;
      }
    }

    const metodo = requisicao.method || 'HTTP';
    // Evitar registrar parâmetros de query (que podem conter dados pessoais).
    const caminho = (requisicao.path || requisicao.url || '/').split('?')[0];
    if (status >= 500) {
      const detalhes =
        excecao instanceof Error
          ? (excecao.stack ?? excecao.message)
          : String(excecao);
      this.logger.error(`${metodo} ${caminho} -> ${status}`, detalhes);
    } else {
      const resumo = Array.isArray(mensagem) ? mensagem.join('; ') : mensagem;
      this.logger.warn(`${metodo} ${caminho} -> ${status}: ${resumo}`);
    }

    const corpo: RespostaErro = {
      sucesso: false,
      status,
      message: mensagem,
      caminho,
      dataHora: new Date().toISOString(),
    };
    resposta.status(status).json(corpo);
  }
}
