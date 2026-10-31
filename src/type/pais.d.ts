import type { Usuario } from './Usuario.d.ts';

export interface Pais {
  codigo_pais: string;
  cpf: string;
  email_1: string;
  email_2?: string | null;
  telefone: string;
  nome: string;
  usuario_codigo: string;
  usuario?: Usuario;
}

export interface PaisInput {
  codigo_pais?: string;
  cpf: string;
  email_1: string;
  email_2?: string | null;
  telefone: string;
  nome: string;
  usuario_codigo: string;
}