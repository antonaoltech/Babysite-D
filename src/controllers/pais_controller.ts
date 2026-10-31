import { Request, Response, NextFunction } from 'express';
import Pais from '../models/pais.js';
import Filhos from '../models/Filhos.js';
import Usuario from '../models/Usuario.js';
import HttpError from '../errors/HttpError.js';

async function read(req: Request, res: Response, next: NextFunction) {
  try {
    const lista = await Pais.read();
    res.json(lista);
  } catch (error: any) {
    next(new HttpError('Não foi possível buscar os responsáveis.', 400));
  }
}

async function readById(req: Request, res: Response, next: NextFunction) {
  try {
    const pai = await Pais.readById(req.params.id);
    res.json(pai);
  } catch (error: any) {
    next(new HttpError('Responsável não encontrado.', 404));
  }
}

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body ?? {};

    const rawCpf = data.cpf || '';
    const cpfDigits = String(rawCpf).replace(/\D/g, '');
    if (!/^\d{11}$/.test(cpfDigits)) {
      throw new HttpError('CPF inválido. Deve conter 11 dígitos numéricos.', 400);
    }

    const finalEmail = data.email_1 || data.email || data.email_principal || '';
    if (!finalEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(finalEmail)) {
      throw new HttpError('Email inválido. Deve conter "@" e um domínio válido.', 400);
    }

    const nome = data.nome || data.name || '';
    const telefone = data.telefone || data.phone || '';
    if (!nome || !telefone) {
      throw new HttpError('Nome e telefone são obrigatórios.', 400);
    }

    const usuario = await Usuario.ensureFromCadastro({
      cpf: cpfDigits,
      email_1: finalEmail,
      email_2: data.email_2 ?? data.email2 ?? data.email_secundario ?? null,
      telefone,
      nome,
    });

    const novoPais = await Pais.create({
      ...data,
      cpf: cpfDigits,
      email_1: finalEmail,
      email_2: data.email_2 ?? data.email2 ?? data.email_secundario ?? null,
      telefone,
      nome,
      usuario_codigo: data.usuario_codigo || usuario.usuario_codigo,
    });

    const filhos = Array.isArray(data.filhos) ? data.filhos : [];
    for (const filho of filhos) {
      await Filhos.create({
        cpf: String(filho?.cpf || '').replace(/\D/g, ''),
        nome: String(filho?.nome || '').trim(),
        alergias: String(filho?.documento_alergia || filho?.alergias || 'Sem alergias'),
        usuario_codigo: usuario.usuario_codigo,
      });
    }

    res.status(201).json(novoPais);
  } catch (error: any) {
    if (error instanceof HttpError) return next(error);
    next(new HttpError('Não foi possível cadastrar o responsável: ' + error.message, 400));
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const paiAtualizado = await Pais.update({ ...req.body, codigo_pais: req.params.id });
    res.json(paiAtualizado);
  } catch (error: any) {
    next(new HttpError('Não foi possível atualizar o responsável.', 400));
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    if (await Pais.remove(req.params.id)) {
      res.sendStatus(204);
    }
  } catch (error: any) {
    next(new HttpError('Não foi possível remover o responsável.', 400));
  }
}

export default { read, readById, create, update, remove };