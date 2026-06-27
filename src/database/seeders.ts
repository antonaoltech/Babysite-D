import Usuario from '../models/Usuario.js';
import Pais from '../models/pais.js';
import Baba from '../models/baba.js';
import Filhos from '../models/Filhos.js';
import { prisma } from './prisma.js';
import seedersData from './seeders.json' with { type: 'json' };

// Interface simples para tipar a estrutura do seu JSON de seeders
interface SeedData {
  usuarios?: any[];
  pais?: any[];
  babas?: any[];
  filhos?: any[];
}

async function up(): Promise<void> {
  console.log("Limpando dados antigos com o Prisma antes de popular...");

  // 1. Limpa o banco na ordem reversa das chaves estrangeiras para evitar erros de restrição
  await prisma.filhos.deleteMany();
  await prisma.baba.deleteMany();
  await prisma.pais.deleteMany();
  await prisma.usuario.deleteMany();

  console.log("Populando o banco de dados do Babysite através dos Models...");

  const data = seedersData as SeedData;

  // 2. Popula Usuários
  if (data.usuarios) {
    for (const usuario of data.usuarios) {
      await Usuario.create(usuario);
    }
  }

  // 3. Popula Pais
  if (data.pais) {
    for (const pai of data.pais) {
      await Pais.create(pai);
    }
  }

  // 4. Popula Babás
  if (data.babas) {
    for (const b of data.babas) {
      await Baba.create(b);
    }
  }

  // 5. Popula Filhos
  if (data.filhos) {
    for (const filho of data.filhos) {
      await Filhos.create(filho);
    }
  }

  console.log("Banco de dados populado com absoluto sucesso! 🎉");
}

export default { up };