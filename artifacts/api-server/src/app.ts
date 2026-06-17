import express from 'express';
import cors from 'cors';
import { eventsRouter } from './routes/events';
import { authRouter } from './routes/auth';
import { healthRouter } from './routes/health';
import { dashboardRouter } from './routes/dashboard';

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o: string) => o.trim())
  : [];

app.use(cors({
  origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
  credentials: true,
}));

app.use(express.json());

app.use('/api/events', eventsRouter);
app.use('/api/auth', authRouter);
app.use('/api/healthz', healthRouter);
app.use('/api/dashboard', dashboardRouter);

export default app;
