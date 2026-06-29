import { prisma } from '../database/prisma.js';

export interface PaisInput {
  codigo_pais?: string;
  cpf: string;
  email_1: string;
  email_2?: string | null;
  telefone: string;
  nome: string;
  usuario_codigo: string;
}

async function create(data: PaisInput) {
  if (data.cpf && data.email_1 && data.telefone && data.usuario_codigo) {
    const createData: any = {
      cpf: data.cpf,
      email_1: data.email_1,
      email_2: data.email_2,
      telefone: data.telefone,
      nome: data.nome,
      usuario_codigo: data.usuario_codigo,
    };

    if (data.codigo_pais) {
      createData.codigo_pais = data.codigo_pais;
    } else {
      createData.codigo_pais = `pais_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    }

    return prisma.pais.create({
      data: createData,
    });
  } else {
    throw new Error('Não foi possível criar o responsável (Pais).');
  }
}

async function read() {
  return prisma.pais.findMany({ include: { usuario: true } });
}

async function readById(codigo_pais: string) {
  const pais = await prisma.pais.findUnique({ 
    where: { codigo_pais },
    include: { usuario: true } 
  });
  if (pais) {
    return pais;
  }
  throw new Error('Responsável (Pais) não encontrado.');
}

async function update({
  codigo_pais,
  ...data
}: Partial<PaisInput> & { codigo_pais: string }) {
  if (codigo_pais) {
    return prisma.pais.update({
      where: { codigo_pais },
      data,
    });
  } else {
    throw new Error('Não foi possível atualizar o responsável.');
  }
}

async function remove(codigo_pais: string): Promise<boolean> {
  await prisma.pais.delete({ where: { codigo_pais } });
  return true;
}

export default { create, read, readById, update, remove };