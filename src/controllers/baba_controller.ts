import { Request, Response, NextFunction } from 'express';
import Baba from '../models/baba.js';
import Usuario from '../models/Usuario.js';
import HttpError from '../errors/HttpError.js';

async function read(req: Request, res: Response, next: NextFunction) {
  try {
    const babas = await Baba.read();
    res.json(babas);
  } catch (error: any) {
    next(new HttpError('Não foi possível buscar as babás.', 400));
  }
}

async function readById(req: Request, res: Response, next: NextFunction) {
  try {
    const baba = await Baba.readById(req.params.id);
    res.json(baba);
  } catch (error: any) {
    next(new HttpError(error.message || 'Babá não encontrada.', 404));
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

    const novaBaba = await Baba.create({
      ...data,
      cpf: cpfDigits,
      email_1: finalEmail,
      email_2: data.email_2 ?? data.email2 ?? data.email_secundario ?? null,
      telefone,
      nome,
      usuario_codigo: data.usuario_codigo || usuario.usuario_codigo,
    });

    res.status(201).json(novaBaba);
  } catch (error: any) {
    if (error instanceof HttpError) return next(error);
    next(new HttpError('Não foi possível cadastrar a babá: ' + error.message, 400));
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const atualizada = await Baba.update({ ...req.body, codigo_baba: req.params.id });
    res.json(atualizada);
  } catch (error: any) {
    next(new HttpError('Não foi possível atualizar a babá.', 400));
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    if (await Baba.remove(req.params.id)) {
      res.sendStatus(204);
    }
  } catch (error: any) {
    next(new HttpError('Não foi possível remover a babá.', 400));
  }
}

export default { read, readById, create, update, remove };