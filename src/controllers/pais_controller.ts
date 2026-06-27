import { Request, Response, NextFunction } from 'express';
import Pais from '../models/pais.js';
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
    const novoPais = await Pais.create(req.body);
    res.status(201).json(novoPais);
  } catch (error: any) {
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