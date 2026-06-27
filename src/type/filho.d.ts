import type { Usuario } from './Usuario.d.ts';

export interface Filhos {
  codigo_filhos: string;
  cpf: string;
  alergias: string;
  nome: string;
  usuario_codigo: string;
  usuario?: Usuario;
}

export interface FilhosInput {
  codigo_filhos?: string;
  cpf: string;
  alergias?: string;
  nome: string;
  usuario_codigo: string;
}