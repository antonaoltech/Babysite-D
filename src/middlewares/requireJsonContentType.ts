import { Request, Response, NextFunction } from 'express';
import HttpError from '../errors/HttpError.js';

export function requireJsonContentType(req: Request, res: Response, next: NextFunction) {
  // Métodos que costumam enviar dados no corpo (body) da requisição
  const metodosComBody = ['POST', 'PUT', 'PATCH'];

  const method = req.method ?? 'GET';
  if (metodosComBody.includes(method)) {
    const contentType = req.headers?.['content-type'];

    // Verifica se o header content-type existe e se contém 'application/json'
    if (!contentType || !contentType.includes('application/json')) {
      // Se não for JSON, barra na hora com um erro 415 (Unsupported Media Type) ou 400
      throw new HttpError("O cabeçalho 'Content-Type' deve ser obrigatoriamente 'application/json'", 415);
    }
  }

  // Se estiver tudo certo, deixa a requisição passar para a rota correspondente
  next();
}