import { prisma } from '../database/prisma.js';

export interface UsuarioInput {
  usuario_codigo?: string;
  cpf: string;
  email_1: string;
  email_2?: string | null;
  telefone: string;
  nome: string;
}

async function create(data: UsuarioInput) {
  if (data.cpf && data.email_1 && data.telefone && data.nome) {
    const createData: any = {
      cpf: data.cpf,
      email_1: data.email_1,
      email_2: data.email_2,
      telefone: data.telefone,
      nome: data.nome,
    };

    if (data.usuario_codigo) {
      createData.usuario_codigo = data.usuario_codigo;
    }

    return prisma.usuario.create({
      data: createData,
    });
  } else {
    throw new Error('Não foi possível criar o usuário. Dados obrigatórios ausentes.');
  }
}

async function read() {
  return prisma.usuario.findMany();
}

async function readById(usuario_codigo: string) {
  const usuario = await prisma.usuario.findUnique({ where: { usuario_codigo } });
  if (usuario) {
    return usuario;
  }
  throw new Error('Usuário não encontrado.');
}

async function update({
  usuario_codigo,
  ...data
}: Partial<UsuarioInput> & { usuario_codigo: string }) {
  if (usuario_codigo) {
    return prisma.usuario.update({
      where: { usuario_codigo },
      data,
    });
  } else {
    throw new Error('Não foi possível atualizar o usuário.');
  }
}

async function remove(usuario_codigo: string): Promise<boolean> {
  // Nota: O Prisma com onDelete: Cascade no schema deleta os filhos automaticamente.
  await prisma.usuario.delete({ where: { usuario_codigo } });
  return true;
}

// Função extra que você tinha no seu arquivo original
async function findByEmail(email: string) {
  return prisma.usuario.findFirst({
    where: {
      OR: [{ email_1: email }, { email_2: email }],
    },
    include: {
      baba: true, // Se o nome da relação no seu schema for diferente, ajuste aqui
      pais: true,
    }
  });
}

export default { create, read, readById, update, remove, findByEmail };