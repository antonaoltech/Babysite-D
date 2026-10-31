import Migration from './migration.js';
import Seed from './seeders.js';

async function main() {
  await Migration.up();
  await Seed.up();
}

main().catch((error) => {
  console.error('Erro ao carregar o banco de dados:', error);
  process.exit(1);
});
