import { errorHandler, notFoundHandler } from './middlewares/errorHandlers.js';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { resolve } from 'node:path';

import router from './routes.js';
import Migration from './database/migration.js';
import Seed from './database/seeders.js';

dotenv.config();

const app = express();
const PORT = 3000;

// Configuração do Morgan (padrão dev do professor)
app.use(morgan('dev'));

// Configurações cruciais de CORS (Mantidas do seu projeto original)
app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
  })
);

// Permite JSON e mantém o limite alto para suportar as imagens de perfil em Base64
app.use(express.json({ limit: '10mb' }));

// Servir arquivos estáticos do seu Frontend (HTML, CSS, JS visuais)
app.use(express.static('public'));

// Vincula todas as rotas do Babysite sob o prefixo '/api'
app.use('/api', router);

// Sua rota para abrir a Home automaticamente ao acessar http://localhost:3000/
app.get('/', (req: Request, res: Response) => {
  res.sendFile(resolve('public', 'html', 'html_home', 'home.html'));
});

// Executa o banco de dados e popula com dados iniciais antes de subir o servidor
console.log('🔄 Analisando e estruturando tabelas do banco de dados com o Prisma...');
await Migration.up();
await Seed.up();

// Middlewares de erro nativos do professor (substituem os interceptadores manuais antigos)
app.use(notFoundHandler);
app.use(errorHandler);

// Inicializa o servidor local
app.listen(PORT, () => {
  console.log(`\n🚀 ==========================================`);
  console.log(`✅ Servidor Babysite ON e migrado para TypeScript!`);
  console.log(`🏠 Site local: http://localhost:${PORT}`);
  console.log(`============================================\n`);
});