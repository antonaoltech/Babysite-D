import { Request, Response, NextFunction } from 'express';
import Usuario from '../models/Usuario.js';
import HttpError from '../errors/HttpError.js';

async function read(req: Request, res: Response, next: NextFunction) {
  try {
    const usuarios = await Usuario.read();
    res.json(usuarios);
  } catch (error: any) {
    next(new HttpError('Não foi possível buscar os usuários.', 400));
  }
}

async function readById(req: Request, res: Response, next: NextFunction) {
  try {
    const usuario = await Usuario.readById(req.params.id);
    res.json(usuario);
  } catch (error: any) {
    next(new HttpError('Usuário não encontrado.', 404));
  }
}

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const novoUsuario = await Usuario.create(req.body);
    res.status(201).json(novoUsuario);
  } catch (error: any) {
    next(new HttpError('Não foi possível cadastrar o usuário: ' + error.message, 400));
  }
}

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { nome, email } = req.body;
    if (!email) throw new HttpError('Email é obrigatório para login.', 400);

    const usuarioCompleto = await Usuario.findByEmail(email);
    if (!usuarioCompleto) {
      throw new HttpError('Usuário não encontrado. Cadastre-se antes de entrar.', 404);
    }

    if (nome && usuarioCompleto.nome && usuarioCompleto.nome.toLowerCase() !== nome.toLowerCase()) {
      throw new HttpError('Nome e email não conferem.', 400);
    }

    const roles: string[] = [];
    if ((usuarioCompleto as any).baba) roles.push('baba');
    if ((usuarioCompleto as any).pais) roles.push('pais');

    res.json({
      token: 'babysite-session-token',
      usuario: {
        usuario_codigo: usuarioCompleto.usuario_codigo,
        cpf: usuarioCompleto.cpf,
        email_1: usuarioCompleto.email_1,
        email_2: usuarioCompleto.email_2,
        telefone: usuarioCompleto.telefone,
        nome: usuarioCompleto.nome
      },
      roles
    });
  } catch (error: any) {
    if (error instanceof HttpError) return next(error);
    next(new HttpError('Falha ao autenticar o usuário.', 500));
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const atualizado = await Usuario.update({ ...req.body, usuario_codigo: req.params.id });
    res.json(atualizado);
  } catch (error: any) {
    next(new HttpError('Não foi possível atualizar o usuário.', 400));
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    if (await Usuario.remove(req.params.id)) {
      res.sendStatus(204);
    }
  } catch (error: any) {
    next(new HttpError('Não foi possível remover o usuário.', 400));
  }
}

export default { read, readById, create, login, update, remove };