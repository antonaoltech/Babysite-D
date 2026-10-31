import type { Usuario } from './Usuario.d.ts';

export interface Baba {
  codigo_baba: string;
  cpf: string;
  email_1: string;
  email_2?: string | null;
  telefone: string;
  nome: string;
  usuario_codigo: string;
  status_cadastro: string;
  foto?: string | null;
  antecedentes_pdf?: string | null;
  usuario?: Usuario; // Inclui os dados da relação se o Prisma trouxer junto
}

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