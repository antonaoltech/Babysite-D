import { Request, Response, NextFunction } from 'express';
import Filhos from '../models/Filhos.js';
import HttpError from '../errors/HttpError.js';

async function read(req: Request, res: Response, next: NextFunction) {
  try {
    const lista = await Filhos.read();
    res.json(lista);
  } catch (error: any) {
    next(new HttpError('Não foi possível buscar os filhos.', 400));
  }
}

async function readById(req: Request, res: Response, next: NextFunction) {
  try {
    const filho = await Filhos.readById(req.params.id);
    res.json(filho);
  } catch (error: any) {
    next(new HttpError('Filho não encontrado.', 404));
  }
}

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const novoFilho = await Filhos.create(req.body);
    res.status(201).json(novoFilho);
  } catch (error: any) {
    next(new HttpError('Não foi possível cadastrar o filho: ' + error.message, 400));
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const filhoAtualizado = await Filhos.update({ ...req.body, codigo_filhos: req.params.id });
    res.json(filhoAtualizado);
  } catch (error: any) {
    next(new HttpError('Não foi possível atualizar o filho.', 400));
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    if (await Filhos.remove(req.params.id)) {
      res.sendStatus(204);
    }
  } catch (error: any) {
    next(new HttpError('Não foi possível remover o filho.', 400));
  }
}

export default { read, readById, create, update, remove };