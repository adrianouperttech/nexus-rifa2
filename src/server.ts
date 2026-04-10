import 'source-map-support/register';
import express from 'express';
import cors from 'cors';
import adminRoutes from './routes/adminRoutes';
import authRoutes from './routes/authRoutes';
import publicRoutes from './routes/publicRoutes';
import subscriberRoutes from './routes/subscriberRoutes';
import { prisma } from './utils/prisma';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api', adminRoutes);
app.use('/api', authRoutes);
app.use('/api', publicRoutes);
app.use('/api', subscriberRoutes);

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
}

startServer();
