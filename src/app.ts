/* eslint-disable no-console */
import express, { Application } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth';
import forgotPasswordRoute from './routes/reset/password';
import confirmEmailRoute from './routes/confirm/email';

dotenv.config();

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Route Middlewares
app.use('/api/user', [...authRoutes, forgotPasswordRoute, confirmEmailRoute]);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

export default app;
