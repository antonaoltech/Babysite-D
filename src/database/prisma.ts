import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? 'file:./src/database/db.sqlite',
});

export const prisma = new PrismaClient({ adapter });