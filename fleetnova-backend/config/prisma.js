import dotenv from 'dotenv';

import pkg from '@prisma/client';

dotenv.config();

const { PrismaClient } = pkg;

const prisma =
    new PrismaClient();

export default prisma;
//------------------------------------------------------


/* import dotenv from 'dotenv';

//import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaClient } from '@prisma/client';

import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

export default prisma; */