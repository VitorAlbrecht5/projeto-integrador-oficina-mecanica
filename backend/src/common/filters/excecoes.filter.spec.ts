import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { SpiedFunction } from 'jest-mock';
import {
  ArgumentsHost,
  BadRequestException,
  ForbiddenException,
  HttpException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ExcecoesFilter } from './excecoes.filter';

describe('ExcecoesFilter — Aula 14', () => {
  const resposta = { status: jest.fn(), json: jest.fn() };
  let filtro: ExcecoesFilter;
  let warn: SpiedFunction<typeof Logger.prototype.warn>;
  let error: SpiedFunction<typeof Logger.prototype.error>;

  const executar = (
    excecao: unknown,
    metodo = 'GET',
    url = '/api/v1/clientes?filtro=segredo',
  ) => {
    const requisicao = { method: metodo, url };
    const host = {
      switchToHttp: () => ({
        getResponse: () => resposta,
        getRequest: () => requisicao,
      }),
    } as unknown as ArgumentsHost;

    filtro.catch(excecao, host);

    return resposta.json.mock.calls[0][0] as {
      sucesso: false;
      status: number;
      message: string | string[];
      caminho: string;
      dataHora: string;
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resposta.status.mockReturnValue(resposta);

    warn = jest
      .spyOn(Logger.prototype, 'warn')
      .mockImplementation(() => undefined);

    error = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);

    filtro = new ExcecoesFilter();
  });

  afterEach(() => {
    warn.mockRestore();
    error.mockRestore();
  });

  it('padroniza erro 400 e mantém mensagem amigável', () => {
    const corpo = executar(new BadRequestException('Dados inválidos'), 'POST');

    expect(resposta.status).toHaveBeenCalledWith(400);
    expect(corpo).toEqual(
      expect.objectContaining({
        sucesso: false,
        status: 400,
        message: 'Dados inválidos',
      }),
    );
    expect(corpo.dataHora).toEqual(expect.any(String));
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('POST /api/v1/clientes -> 400'),
    );
  });

  it('retém lista de mensagens do ValidationPipe e formato uniforme', () => {
    const corpo = executar(
      new BadRequestException(['nome obrigatório', 'CPF inválido']),
    );

    expect(corpo.message).toEqual(['nome obrigatório', 'CPF inválido']);
    expect(corpo.caminho).toBe('/api/v1/clientes');
  });

  it('conserva status 401 quando não há token', () => {
    const corpo = executar(new UnauthorizedException('Token não informado'));

    expect(corpo.status).toBe(401);
    expect(corpo.message).toBe('Token não informado');
  });

  it('conserva status 403 para perfil sem permissão', () => {
    const corpo = executar(new ForbiddenException('Acesso negado'));

    expect(corpo.status).toBe(403);
    expect(warn).toHaveBeenCalled();
  });

  it('conserva status 404 e remove query string do caminho', () => {
    const corpo = executar(new NotFoundException('Não encontrado'));

    expect(corpo.status).toBe(404);
    expect(corpo.caminho).toBe('/api/v1/clientes');
    expect(corpo.caminho).not.toContain('segredo');
  });

  it('oculta exceção inesperada 500 do cliente e registra stack no log', () => {
    const corpo = executar(new Error('detalhes internos secretos'));

    expect(resposta.status).toHaveBeenCalledWith(500);
    expect(corpo.message).toBe('Erro interno. Tente novamente mais tarde.');
    expect(JSON.stringify(corpo)).not.toContain('secretos');
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('-> 500'),
      expect.any(String),
    );
  });

  it('também oculta o detalhe técnico de um HttpException 503', () => {
    const corpo = executar(new HttpException('Erro de infraestrutura', 503));

    expect(corpo.status).toBe(503);
    expect(corpo.message).toBe('Erro interno. Tente novamente mais tarde.');
  });
});
