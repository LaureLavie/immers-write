// src/lib/prisma.ts

import { PrismaClient } from '@prisma/client';

/**
 * Singleton Pattern pour Prisma Client
 * 
 * POURQUOI ?
 * En développement, Next.js fait du Hot Reload (recharge le code).
 * Sans ce pattern, on créerait une nouvelle connexion à chaque reload,
 * ce qui cause des erreurs "Too many connections".
 * 
 * COMMENT ÇA MARCHE ?
 * - En production : On crée une instance unique
 * - En dev : On stocke l'instance dans globalThis (survit au reload)
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// En développement, on stocke l'instance
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * USAGE DANS VOTRE CODE :
 * 
 * import { prisma } from '@/lib/prisma';
 * 
 * const users = await prisma.user.findMany();
 * const story = await prisma.story.create({ data: {...} });
 */