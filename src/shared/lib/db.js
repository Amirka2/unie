import { MODE } from '@/core/constants';
import { PrismaClient } from '@prisma/client';

let prisma;

if (MODE === 'production') {
    prisma = new PrismaClient();
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient({
            log: ['query', 'info', 'warn', 'error'],
        });
    }
    prisma = global.prisma;
}

export { prisma };
