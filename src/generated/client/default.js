const { PrismaClient } = require('@prisma/client/runtime/library');

const prisma = new PrismaClient();

module.exports = prisma;
