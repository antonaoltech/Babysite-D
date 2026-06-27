import { resolve } from 'node:path';
import * as sqliteAsync from 'sqlite-async';
import { createClient, Client } from '@libsql/client';

const { Database } = sqliteAsync as typeof sqliteAsync & { Database: any };

// Caminho absoluto para a base de dados dentro de src/database
const dbFile: string = resolve('src', 'database', 'db.sqlite');

// URL formatada que o LibSQL/Prisma exige
const dbUrl: string = `file:${dbFile}`;

// 1. Conexão assíncrona tradicional que o teu projeto já usava
async function connect(): Promise<any> {
  return await Database.open(dbFile);
}

// 2. Cliente LibSQL que o Prisma 7 vai usar para os Driver Adapters
const libsqlClient: Client = createClient({
  url: dbUrl,
});

export default { 
  connect,
  libsqlClient 
};