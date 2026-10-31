import { prisma } from '../database/prisma.js';

export interface FilhosInput {
  codigo_filhos?: string;
  cpf: string;
  alergias: string;
  nome: string;
  usuario_codigo: string;
}

async function create(data: FilhosInput) {
  if (data.cpf && data.nome && data.usuario_codigo) {
    const createData: any = {
      cpf: data.cpf,
      alergias: data.alergias || 'Sem alergias',
      nome: data.nome,
      usuario_codigo: data.usuario_codigo,
    };

    if (data.codigo_filhos) {
      createData.codigo_filhos = data.codigo_filhos;
    } else {
      createData.codigo_filhos = `filho_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    }

    return prisma.filhos.create({
      data: createData,
    });
  } else {
    throw new Error('Não foi possível cadastrar o filho.');
  }
}

async function read() {
  return prisma.filhos.findMany({ include: { usuario: true } });
}

async function readById(codigo_filhos: string) {
  const filho = await prisma.filhos.findUnique({ 
    where: { codigo_filhos },
    include: { usuario: true } 
  });
  if (filho) {
    return filho;
  }
  throw new Error('Filho não encontrado.');
}

async function update({
  codigo_filhos,
  ...data
}: Partial<FilhosInput> & { codigo_filhos: string }) {
  if (codigo_filhos) {
    return prisma.filhos.update({
      where: { codigo_filhos },
      data,
    });
  } else {
    throw new Error('Não foi possível atualizar o filho.');
  }
}

async function remove(codigo_filhos: string): Promise<boolean> {
  await prisma.filhos.delete({ where: { codigo_filhos } });
  return true;
}

export default { create, read, readById, update, remove };