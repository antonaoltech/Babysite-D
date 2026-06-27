import fs from 'node:fs';
import path from 'node:path';
import Database from './database.js';

async function up(): Promise<void> {
  console.log('Iniciando a migração baseada no arquivo do Prisma...');

  const db = await Database.connect();

  const caminhoMigration = path.resolve(
    'prisma',
    'migrations',
    '20260627161650_migracao_final',
    'migration.sql'
  );

  console.log(`Lendo o arquivo SQL em: ${caminhoMigration}`);

  if (!fs.existsSync(caminhoMigration)) {
    throw new Error(`Arquivo migration.sql não foi encontrado em: ${caminhoMigration}`);
  }

  const sqlComandos = fs.readFileSync(caminhoMigration, 'utf-8');
  const sqlLimpo = sqlComandos
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);

  console.log('Executando os comandos do migration.sql no banco de dados...');

  for (const statement of sqlLimpo) {
    try {
      await db.run(`${statement};`);
    } catch (error: any) {
      if (error?.message?.includes('already exists') || error?.message?.includes('duplicate')) {
        console.warn('Ignorando comando já aplicado:', statement);
        continue;
      }
      throw error;
    }
  }

  console.log('Banco de dados atualizado e tabelas criadas com sucesso! 🎉');
}

export default { up };