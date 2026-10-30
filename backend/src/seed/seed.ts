import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module'; // Corrigido com '../'
import { getModelToken } from '@nestjs/mongoose';
import { Servico } from '../servicos/servico.schema'; // Corrigido com '../'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const servicoModel = app.get(getModelToken(Servico.name));

  const servicosIniciais = [
    {
      nome: 'Troca de Óleo e Filtro',
      descricao: 'Substituição completa do óleo do motor e troca do elemento filtrante.',
      preco: 150.00,
      tempoEstimado: '45 minutos'
    },
    {
      nome: 'Alinhamento e Balanceamento',
      descricao: 'Ajuste da geometria da suspensão e balanceamento das quatro rodas.',
      preco: 120.00,
      tempoEstimado: '1 hora'
    },
    {
      nome: 'Revisão do Sistema de Freios',
      descricao: 'Inspeção, limpeza e troca de pastilhas de freio dianteiras.',
      preco: 280.00,
      tempoEstimado: '2 horas'
    },
    {
      nome: 'Substituição da Correia Dentada',
      descricao: 'Troca preventiva da correia dentada e tensor do motor.',
      preco: 450.00,
      tempoEstimado: '3 horas'
    },
    {
      nome: 'Higienização do Ar-Condicionado',
      descricao: 'Limpeza de dutos com bactericida e troca do filtro de cabine.',
      preco: 110.00,
      tempoEstimado: '40 minutos'
    }
  ];

  await servicoModel.deleteMany({});
  await servicoModel.insertMany(servicosIniciais);

  console.log('✅ Seed de 5 serviços executado com sucesso!');
  await app.close();
}

bootstrap();