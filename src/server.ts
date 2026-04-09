import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import raffleRoutes from './routes/raffleRoutes';
import buyerRoutes from './routes/buyerRoutes';
import reservationRoutes from './routes/reservationRoutes';
import { startCron } from './utils/cron';
import { prisma } from './utils/prisma';
import 'source-map-support/register';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api', userRoutes);
app.use('/api', raffleRoutes);
app.use('/api', buyerRoutes);
app.use('/api', reservationRoutes);

async function startServer() {
  try {
    // The Prisma client is now initialized in utils/prisma.ts, 
    // so we just need to ensure the connection is alive.
    await prisma.$connect();
    console.log('Database connected successfully');

    // Start the cron job
    startCron(prisma);

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

  } catch (error) {
    console.error('Failed to start the server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
