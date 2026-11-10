import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RespostaInterceptor } from './common/interceptors/resposta.interceptor';
import { ExcecoesFilter } from './common/filters/excecoes.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Todas as rotas começam com /api/v1 (versionamento desde o início — PDF 04, cap. 11)
  app.setGlobalPrefix('api/v1');

  // Permite que o front-end Angular (porta 4200) chame a API
  app.enableCors({ origin: 'http://localhost:4200' });

  // Validação automática dos DTOs com configuração completa (PDF 04, cap. 12 e 13)
  // whitelist: remove campos que não estão no DTO
  // forbidNonWhitelisted: devolve 400 se vier campo desconhecido
  // transform: converte o JSON recebido na classe do DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Padrão único de resposta de sucesso (PDF 04, cap. 14)
  app.useGlobalInterceptors(new RespostaInterceptor());

  // Aula 14: erros padronizados; detalhes técnicos ficam apenas nos logs.
  app.useGlobalFilters(new ExcecoesFilter());

  // Documentação Swagger em http://localhost:3000/api/v1/api/docs (ou ajustado)
  const config = new DocumentBuilder()
    .setTitle('Garagem Pro — API')
    .setDescription(
      'Gestão de clientes, veículos, serviços, ordens de serviço e consulta pública por placa.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup(
    'api/docs',
    app,
    SwaggerModule.createDocument(app, config),
  );

  const porta = process.env.PORT ?? 3000;
  await app.listen(porta);
  console.log(`API rodando em http://localhost:${porta}/api/v1`);
  console.log(`Swagger em http://localhost:${porta}/api/docs`);
}
void bootstrap();
