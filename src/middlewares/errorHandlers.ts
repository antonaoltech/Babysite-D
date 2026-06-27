import { Request, Response, NextFunction } from 'express';
import HttpError from '../errors/HttpError.js';

// 1. Tratador de Rotas Não Encontradas (404)
export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  // Se chegou aqui, é porque nenhuma rota antes capturou a requisição
  res.status(404).json({ 
    message: `Conteúdo não encontrado! O caminho '${req.originalUrl}' não existe nesta API.` 
  });
}

// 2. Tratador de Erros Global (Captura qualquer falha ou throw new HttpError)
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error("❌ Erro capturado pelo Middleware:", err.message);

  // Se o erro foi gerado por nós usando o 'HttpError', usamos o código customizado (ex: 400, 404)
  if (err instanceof HttpError || (err.code && typeof err.code === 'number')) {
    return res.status(err.code || 400).json({ message: err.message });
  }

  // Se for um erro desconhecido do sistema (ex: bug de sintaxe ou falha no Prisma), envia 500
  return res.status(500).json({ 
    message: 'Algo quebrou no servidor! Erro interno.' 
  });
}