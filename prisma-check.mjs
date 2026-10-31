import { prisma } from './src/database/prisma.ts';
const data = { usuario_codigo: 'test-user', cpf: '11111111111', email_1: 'a@b.com', email_2: null, telefone: '123', nome: 'Test' };
try {
  const res = await prisma.usuario.create({ data });
  console.log(JSON.stringify(res));
} catch (e) {
  console.error(e);
} finally {
  await prisma.$disconnect();
}
