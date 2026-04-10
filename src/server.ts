import 'source-map-support/register';
import express from 'express';
import cors from 'cors';
import adminRoutes from './routes/adminRoutes';
import authRoutes from './routes/authRoutes';
import publicRoutes from './routes/publicRoutes';
import subscriberRoutes from './routes/subscriberRoutes';
import { getPrismaClient } from './utils/prisma';

const app = express();
const port = process.env.PORT || 3000;

async function main() {
  const prisma = getPrismaClient();

  // Test the database connection before starting the server
  try {
    await prisma.$connect();
    console.log('Database connection successful.');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }

  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('API is running...');
  });

  app.use('/api', adminRoutes);
  app.use('/api', authRoutes);
  app.use('/api', publicRoutes);
  app.use('/api', subscriberRoutes);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
