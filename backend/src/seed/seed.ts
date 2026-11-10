import 'dotenv/config';
import { createHash } from 'node:crypto';
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { isEmail } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { AppModule } from '../app.module';
import { Usuario } from '../usuarios/schemas/usuario.schema';
import { Cliente } from '../clientes/schemas/cliente.schema';
import {
  Veiculo,
  type StatusVeiculo,
} from '../veiculos/schemas/veiculo.schema';
import { Servico } from '../servicos/servico.schema';
import {
  OrdemServico,
  type StatusOrdem,
} from '../ordens-servico/ordem-servico.schema';

/** Dados fictícios para demonstração. O script NÃO apaga coleções. */
const NOMES = [
  'Ana Beatriz Martins',
  'Bruno Henrique Castro',
  'Carla Fernanda Lima',
  'Daniel Oliveira Costa',
  'Eduarda Ribeiro Nunes',
  'Felipe Augusto Souza',
  'Gabriela Moraes Silva',
  'Henrique Almeida Rocha',
  'Isabela Pereira Dias',
  'João Pedro Moreira',
  'Karen Cristina Lopes',
  'Lucas Gabriel Ferreira',
  'Mariana Vieira Santos',
  'Nathan Rodrigues Freitas',
  'Olívia Cardoso Mendes',
  'Paulo Roberto Teixeira',
  'Renata Gomes Barbosa',
  'Samuel Andrade Cunha',
  'Tatiane Azevedo Pinto',
  'Vinícius Martins Machado',
];

const CARROS = [
  ['Ford Escort Hobby', 1995, 'Vermelho', 'Revisão de freios e suspensão'],
  ['Volkswagen Gol G4', 2008, 'Prata', 'Motor falhando em marcha lenta'],
  ['Chevrolet Vectra GLS', 1998, 'Azul', 'Barulho na direção hidráulica'],
  ['Chevrolet Onix', 2020, 'Branco', 'Revisão preventiva e troca de óleo'],
  ['Hyundai HB20', 2022, 'Cinza', 'Ar-condicionado com pouco rendimento'],
  ['Fiat Uno Mille', 2006, 'Verde', 'Dificuldade na partida'],
  ['Chevrolet Celta', 2012, 'Preto', 'Pastilhas de freio gastas'],
  ['Fiat Palio Fire', 2010, 'Prata', 'Vazamento no sistema de arrefecimento'],
  ['Chevrolet Corsa Classic', 2011, 'Branco', 'Luz de injeção acesa'],
  ['Renault Sandero', 2016, 'Vermelho', 'Vibração acima de 80 km/h'],
  ['Volkswagen Fox', 2014, 'Azul', 'Ruído na suspensão dianteira'],
  ['Peugeot 206', 2007, 'Prata', 'Falha elétrica intermitente'],
  ['Ford Ka', 2017, 'Branco', 'Desgaste irregular dos pneus'],
  ['Honda Fit', 2013, 'Cinza', 'Revisão e troca dos filtros'],
  ['Honda Civic', 2015, 'Preto', 'Inspeção do sistema de freios'],
  ['Toyota Corolla', 2019, 'Prata', 'Troca de óleo da transmissão'],
  ['Fiat Siena', 2011, 'Branco', 'Barulho no escapamento'],
  ['Nissan March', 2018, 'Vermelho', 'Sistema de carga da bateria'],
  ['Renault Clio', 2005, 'Azul', 'Troca de correia dentada'],
  ['Volkswagen Voyage', 2017, 'Preto', 'Manutenção da embreagem'],
] as const;

const SERVICOS = [
  [
    'Troca de óleo do motor',
    'Substituição do lubrificante conforme especificação.',
    170,
    '45 min',
  ],
  ['Troca do filtro de óleo', 'Substituição do filtro de óleo.', 55, '25 min'],
  ['Troca do filtro de ar', 'Substituição do filtro do motor.', 65, '20 min'],
  [
    'Troca do filtro de cabine',
    'Substituição do filtro do ar-condicionado.',
    85,
    '30 min',
  ],
  [
    'Troca do filtro de combustível',
    'Substituição preventiva do filtro.',
    95,
    '40 min',
  ],
  ['Alinhamento de direção', 'Ajuste da geometria das rodas.', 110, '50 min'],
  ['Balanceamento das rodas', 'Balanceamento das quatro rodas.', 95, '45 min'],
  [
    'Troca de pastilhas de freio',
    'Substituição das pastilhas dianteiras.',
    240,
    '1h 30min',
  ],
  [
    'Troca de discos de freio',
    'Substituição dos discos dianteiros.',
    420,
    '2h',
  ],
  ['Revisão de freios', 'Inspeção do sistema de frenagem.', 130, '1h'],
  [
    'Sangria do fluido de freio',
    'Troca e sangria do fluido de freio.',
    120,
    '50 min',
  ],
  [
    'Troca de amortecedores',
    'Substituição de par de amortecedores.',
    620,
    '3h',
  ],
  ['Troca de bieletas', 'Substituição das bieletas da suspensão.', 180, '1h'],
  ['Troca de pivôs', 'Substituição de pivôs de suspensão.', 260, '2h'],
  [
    'Troca de correia dentada',
    'Troca de correia e verificação do tensor.',
    560,
    '3h',
  ],
  [
    'Troca de correia de acessórios',
    'Substituição da correia auxiliar.',
    180,
    '1h',
  ],
  ['Troca de velas de ignição', 'Instalação de velas novas.', 190, '1h'],
  [
    'Limpeza de bicos injetores',
    'Limpeza e teste dos bicos injetores.',
    220,
    '2h',
  ],
  [
    'Diagnóstico eletrônico',
    'Leitura e análise de falhas via scanner.',
    130,
    '50 min',
  ],
  ['Teste de bateria', 'Avaliação da carga e partida.', 55, '20 min'],
  ['Troca de bateria', 'Instalação de bateria compatível.', 460, '30 min'],
  ['Reparo no alternador', 'Avaliação e recuperação do alternador.', 380, '3h'],
  [
    'Troca de líquido de arrefecimento',
    'Limpeza e troca do fluido.',
    180,
    '1h',
  ],
  [
    'Troca de mangueiras do radiador',
    'Substituição de mangueiras de arrefecimento.',
    240,
    '1h 30min',
  ],
  [
    'Higienização do ar-condicionado',
    'Limpeza de dutos e evaporador.',
    160,
    '1h',
  ],
  [
    'Carga de gás do ar-condicionado',
    'Teste e recarga conforme especificação.',
    240,
    '1h 30min',
  ],
  ['Troca de embreagem', 'Substituição do conjunto de embreagem.', 980, '5h'],
  [
    'Troca de óleo do câmbio',
    'Substituição do fluido de transmissão.',
    290,
    '1h',
  ],
  ['Reparo no escapamento', 'Inspeção e vedação do escapamento.', 220, '2h'],
  [
    'Revisão geral preventiva',
    'Inspeção preventiva de itens mecânicos.',
    350,
    '2h 30min',
  ],
] as const;

function cpfDeExemplo(numero: number): string {
  // CPFs sintéticos, apenas para preencher o banco de demonstração.
  const base = `970001${String(numero).padStart(3, '0')}`;
  const digito = (valor: string, peso: number): number => {
    const soma = [...valor].reduce(
      (total, dig, i) => total + Number(dig) * (peso - i),
      0,
    );
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  const primeiro = digito(base, 10);
  return `${base}${primeiro}${digito(`${base}${primeiro}`, 11)}`;
}

function idSeed(chave: string): Types.ObjectId {
  const hex = createHash('sha256')
    .update(`garagem-pro-demo-v1:${chave}`)
    .digest('hex');
  return new Types.ObjectId(hex.slice(0, 24));
}

function diasAtras(dias: number): Date {
  const data = new Date();
  data.setDate(data.getDate() - dias);
  return data;
}

async function bootstrap(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'O seed de demonstração não é permitido em ambiente de produção.',
    );
  }
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const senha = process.env.ADMIN_SENHA;
  if (
    !email ||
    !isEmail(email) ||
    !senha ||
    senha.length < 6 ||
    Buffer.byteLength(senha, 'utf8') > 72
  ) {
    throw new Error(
      'Configure ADMIN_EMAIL e ADMIN_SENHA no backend/.env (senha entre 6 e 72 bytes).',
    );
  }

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });
  try {
    const clientes = app.get<Model<Cliente>>(getModelToken(Cliente.name));
    const veiculos = app.get<Model<Veiculo>>(getModelToken(Veiculo.name));
    const servicos = app.get<Model<Servico>>(getModelToken(Servico.name));
    const ordens = app.get<Model<OrdemServico>>(
      getModelToken(OrdemServico.name),
    );
    // O login utiliza o modelo Usuario na coleção admins, e não o modelo legado Admin.
    const usuarios = app.get<Model<Usuario>>(getModelToken(Usuario.name));

    console.log(
      'Seed de demonstração: inserção segura, sem exclusão de dados.',
    );
    const administrador = await usuarios.findOne({ email }).exec();
    if (!administrador) {
      await usuarios.create({
        nome: 'Administrador',
        email,
        perfil: 'admin',
        senhaHash: await bcrypt.hash(senha, 12),
      });
      console.log('Administrador criado com as credenciais do .env.');
    } else {
      console.log('Administrador existente preservado (senha não alterada).');
    }

    const idsServicos: Types.ObjectId[] = [];
    for (const [nome, descricao, preco, tempoEstimado] of SERVICOS) {
      const item = await servicos
        .findOneAndUpdate(
          { nome },
          {
            $setOnInsert: {
              nome,
              descricao,
              preco,
              tempoEstimado,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
            runValidators: true,
            timestamps: false,
          },
        )
        .exec();
      if (!item) throw new Error(`Falha ao cadastrar o serviço: ${nome}`);
      idsServicos.push(item._id);
    }

    const idsClientes: Types.ObjectId[] = [];
    for (let i = 0; i < NOMES.length; i++) {
      const cpf = cpfDeExemplo(i + 1);
      const cliente = await clientes
        .findOneAndUpdate(
          { cpf },
          {
            $setOnInsert: {
              nomeCompleto: NOMES[i],
              cpf,
              telefone: `5199000${String(i + 1).padStart(4, '0')}`,
              email: `cliente${String(i + 1).padStart(2, '0')}@exemplo.test`,
              endereco: {
                cep: '93210-100',
                rua: 'Rua Exemplo',
                numero: String(100 + i),
                bairro: 'Centro',
                cidade: i % 2 === 0 ? 'Esteio' : 'São Leopoldo',
                estado: 'RS',
              },
              observacoes: 'Cadastro fictício para apresentação.',
              ativo: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
            runValidators: true,
            timestamps: false,
          },
        )
        .exec();
      if (!cliente)
        throw new Error(`Falha ao cadastrar cliente de demonstração ${i + 1}`);
      idsClientes.push(cliente._id);
    }

    const idsVeiculos: Types.ObjectId[] = [];
    const statusAtuais: StatusOrdem[] = [
      'Na Fila',
      'Em Conserto',
      'Aguardando Peça',
      'Pronto',
      'Em Conserto',
      'Na Fila',
      'Pronto',
      'Aguardando Peça',
      'Em Conserto',
      'Pronto',
      'Aguardando Peça',
      'Na Fila',
      'Pronto',
      'Em Conserto',
      'Pronto',
      'Na Fila',
      'Em Conserto',
      'Pronto',
      'Aguardando Peça',
      'Pronto',
    ];
    for (let i = 0; i < CARROS.length; i++) {
      const [modelo, ano, cor, defeitoRelatado] = CARROS[i];
      const placa = `IAB1A${String(i + 1).padStart(2, '0')}`;
      // Alguns clientes têm mais de um carro; os demais continuam disponíveis para cadastros.
      const indiceCliente = i < 16 ? i : i - 16;
      const carro = await veiculos
        .findOneAndUpdate(
          { placa },
          {
            $setOnInsert: {
              placa,
              modelo,
              ano,
              cor,
              defeitoRelatado,
              status: statusAtuais[i],
              clienteId: idsClientes[indiceCliente],
              ativo: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
            runValidators: true,
            timestamps: false,
          },
        )
        .exec();
      if (!carro) throw new Error(`Falha ao cadastrar veículo ${placa}`);
      if (String(carro.clienteId) !== String(idsClientes[indiceCliente])) {
        throw new Error(
          `A placa ${placa} já pertence a outro cliente. Use um banco de demonstração vazio.`,
        );
      }
      idsVeiculos.push(carro._id);
    }

    // Dez atendimentos antigos concluídos e vinte atendimentos mais recentes.
    // No máximo uma ordem em andamento por veículo.
    for (let i = 0; i < 30; i++) {
      const historico = i < 10;
      const indiceVeiculo = historico ? i : i - 10;
      const entrada = diasAtras(
        historico ? 50 - i * 2 : 20 - Math.floor(indiceVeiculo / 2),
      );
      const status: StatusOrdem = historico
        ? 'Pronto'
        : statusAtuais[indiceVeiculo];
      const indices = historico
        ? [
            (indiceVeiculo * 2 + 1) % SERVICOS.length,
            (indiceVeiculo * 2 + 4) % SERVICOS.length,
          ]
        : [
            indiceVeiculo % SERVICOS.length,
            (indiceVeiculo + 7) % SERVICOS.length,
            (indiceVeiculo + 15) % SERVICOS.length,
          ];
      const finalizacao =
        status === 'Pronto'
          ? diasAtras(historico ? 40 - i : 2 + (indiceVeiculo % 5))
          : entrada;
      await ordens
        .findOneAndUpdate(
          { _id: idSeed(`ordem:${i + 1}`) },
          {
            $setOnInsert: {
              veiculoId: idsVeiculos[indiceVeiculo],
              clienteId:
                indiceVeiculo < 16
                  ? idsClientes[indiceVeiculo]
                  : idsClientes[indiceVeiculo - 16],
              descricaoProblema: historico
                ? `Manutenção anterior concluída: ${CARROS[indiceVeiculo][3].toLowerCase()}.`
                : `Atendimento atual: ${CARROS[indiceVeiculo][3].toLowerCase()}.`,
              status,
              servicosIds: indices.map((indice) => idsServicos[indice]),
              dataEntrada: entrada,
              createdAt: entrada,
              updatedAt: finalizacao,
            },
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
            runValidators: true,
            timestamps: false,
          },
        )
        .exec();
    }

    // Verificação dos IDs relacionados, incluindo todos os documentos já existentes.
    const registrosSeed = await ordens
      .find({
        _id: {
          $in: Array.from({ length: 30 }, (_, i) => idSeed(`ordem:${i + 1}`)),
        },
      })
      .lean()
      .exec();
    if (
      registrosSeed.length !== 30 ||
      registrosSeed.some(
        (os) =>
          !idsVeiculos.some((id) => id.equals(os.veiculoId)) ||
          !idsClientes.some((id) => id.equals(os.clienteId)) ||
          os.servicosIds.some(
            (id) => !idsServicos.some((servico) => servico.equals(id)),
          ),
      )
    ) {
      throw new Error(
        'Verificação de relacionamentos falhou. Confira o banco antes da apresentação.',
      );
    }
    console.log(
      '✓ 20 clientes, 20 veículos, 30 serviços e 30 ordens de exemplo conferidos.',
    );
    console.log(
      '✓ Referências entre clientes, veículos, ordens e serviços verificadas.',
    );
    console.log('✓ Para testar a consulta pública, use a placa IAB1A01.');
    console.log(
      '✓ Você pode executar npm run seed novamente, sem duplicar esses exemplos.',
    );
  } finally {
    await app.close();
  }
}

void bootstrap().catch((erro: unknown) => {
  console.error(
    erro instanceof Error ? erro.message : 'Erro desconhecido no seed.',
  );
  process.exitCode = 1;
});
