/* eslint-disable no-console */
import mongoose from 'mongoose';
import app from './app';

// Connect to DB
const connectionString =
  process.env.DB_CONNECT || 'mongodb://localhost:27017/jokr';

mongoose.connect(
  connectionString,
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

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App listening on port ${port}`));
