/**
 * Popula o banco com dados de exemplo.
 * Uso: npm run seed
 * Cada aluno acrescenta aqui os dados do seu módulo (aula 08).
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { ProdutoSchema } from '../produtos/schemas/produto.schema';
import { VeiculoSchema } from '../veiculos/schemas/veiculo.schema';
const produtos = [
  {
    nome: 'Arroz integral 1 kg',
    preco: 8.9,
    estoque: 25,
    categoria: 'alimento',
  },
  { nome: 'Feijão preto 1 kg', preco: 7.5, estoque: 40, categoria: 'alimento' },
  { nome: 'Sabonete neutro', preco: 2.99, estoque: 60, categoria: 'higiene' },
  { nome: 'Detergente 500 ml', preco: 3.49, estoque: 0, categoria: 'limpeza' },
  { nome: 'Pilha AA (par)', preco: 12.0, estoque: 15, categoria: 'outros' },
];

const veiculos = [
  {
    placa: 'ABC-1234',
    modelo: 'Gol',
    cor: 'Branco',
    ano: 2015,
    defeitoRelatado: 'Motor falhando',
    status: 'Na Fila',
    clienteId: 1,
    ativo: true,
  },
  {
    placa: 'XYZ-9876',
    modelo: 'Civic',
    cor: 'Preto',
    ano: 2020,
    defeitoRelatado: 'Troca de óleo',
    status: 'Em Conserto',
    clienteId: 2,
    imagemUrl: 'https://i.imgur.com/n9PA1de.jpeg',
    ativo: true,
  },
  {
    placa: 'DEF-5678',
    modelo: 'Onix',
    cor: 'Prata',
    ano: 2022,
    defeitoRelatado: 'Bateria descarregada',
    status: 'Pronto',
    clienteId: 1,
    ativo: true,
  },
  {
    placa: 'GHI-1234',
    modelo: 'Ford Escort Hobby',
    cor: 'Vermelho',
    ano: 1995,
    defeitoRelatado: 'Revisão do sistema de freios',
    status: 'Na Fila',
    clienteId: 3,
    imagemUrl: 'https://i.imgur.com/NXcqoGC.jpeg',
    ativo: true,
  },
  {
    placa: 'JKL-5678',
    modelo: 'Toyota Corolla',
    cor: 'Cinza',
    ano: 2023,
    defeitoRelatado: 'Manutenção preventiva',
    status: 'Em Conserto',
    clienteId: 4,
    imagemUrl: 'https://i.imgur.com/SBDVqJz.jpeg',
    ativo: true,
  },
];

async function seed() {
  const uri =
    process.env.MONGODB_URI ?? 'mongodb://localhost:27017/projeto-integrador';
  await mongoose.connect(uri);

  const Produto = mongoose.model('Produto', ProdutoSchema, 'produtos');
  await Produto.deleteMany({});
  await Produto.insertMany(produtos);
  console.log(`✔ ${produtos.length} produtos inseridos`);

  // VEICULOS
  const Veiculo = mongoose.model('Veiculo', VeiculoSchema, 'veiculos');
  await Veiculo.deleteMany({});
  await Veiculo.insertMany(veiculos);
  console.log(`✔ ${veiculos.length} veículos inseridos`);
  // TODO (aula 08): insira aqui os dados de exemplo do seu módulo

  await mongoose.disconnect();
}

seed().catch((erro) => {
  console.error('Erro no seed:', erro);
  process.exit(1);
});
