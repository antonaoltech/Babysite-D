import { prisma } from '../database/prisma.js';

export interface BabaInput {
  codigo_baba?: string;
  cpf: string;
  email_1: string;
  email_2?: string | null;
  telefone: string;
  nome: string;
  usuario_codigo: string;
  status_cadastro?: string;
  foto?: string | null;
  antecedentes_pdf?: string | null;
}

async function create(data: BabaInput) {
  if (data.cpf && data.email_1 && data.telefone && data.usuario_codigo) {
    const createData: any = {
      cpf: data.cpf,
      email_1: data.email_1,
      email_2: data.email_2,
      telefone: data.telefone,
      nome: data.nome,
      usuario_codigo: data.usuario_codigo,
      status_cadastro: data.status_cadastro || 'Ativa',
      foto: data.foto,
      antecedentes_pdf: data.antecedentes_pdf,
    };

    if (data.codigo_baba) {
      createData.codigo_baba = data.codigo_baba;
    }

    return prisma.baba.create({
      data: createData,
    });
  } else {
    throw new Error('Não foi possível vincular a Babá.');
  }
}

async function read() {
  // Substitui o seu antigo readAllBabys, puxando o Usuário junto automaticamente!
  return prisma.baba.findMany({ include: { usuario: true } });
}

async function readById(codigo_baba: string) {
  const baba = await prisma.baba.findUnique({ 
    where: { codigo_baba },
    include: { usuario: true } 
  });
  if (baba) {
    return baba;
  }
  throw new Error('Babá não encontrada.');
}

async function update({
  codigo_baba,
  ...data
}: Partial<BabaInput> & { codigo_baba: string }) {
  if (codigo_baba) {
    return prisma.baba.update({
      where: { codigo_baba },
      data,
    });
  } else {
    throw new Error('Não foi possível atualizar a babá.');
  }
}

async function remove(codigo_baba: string): Promise<boolean> {
  await prisma.baba.delete({ where: { codigo_baba } });
  return true;
}

export default { create, read, readById, update, remove };