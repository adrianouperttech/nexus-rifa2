import express from 'express';
import cors from 'cors';
import path from 'path';

import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import subscriberRoutes from './routes/subscriberRoutes';
import publicRoutes from './routes/publicRoutes';

import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

// Serve static mock uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/ping', (req, res) => {
  res.json({ message: 'pong', api: 'Nexus-Rifa' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/subscriber', subscriberRoutes);
app.use('/api/public', publicRoutes);

app.use(errorHandler);

export default app;
