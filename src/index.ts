/* eslint-disable no-console */
import express, { Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import authRoute from './routes/auth';

dotenv.config();

const app: Application = express();

// Connect to DB
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('connected to db');
  }
);

// Testing the connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  // We're connected!
});

// Middlewares
app.use(express.json());

app.use(express.static(path.join(__dirname, '../client/build')));

// Route Middlewares
app.use('/api/user', authRoute);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App listening on port ${port}`));
