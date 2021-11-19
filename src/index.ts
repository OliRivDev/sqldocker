import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { RequestModel } from './models/request';

const app = express();

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}
const port = process.env.PORT || 8080;
const dbHost = process.env.HOST || 'localhost';
const dbPort = process.env.DATABASE_PORT || 27017;
const dbUser = process.env.DATABASE_USERNAME || '';
const dbPass = process.env.DATABASE_PASSWORD || '';
const database = process.env.DATABASE || 'dockerExpress';

const mongoConnectionUrl = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${database}`;

const connectWithRetry = () => {
  mongoose
    .connect(mongoConnectionUrl)
    .then(() => {
      console.log('Were connected to MongoDb');
    })
    .catch((err) => {
      console.log('Error connecting to Mongo', err);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

app.get('/', (req: any, res: any) => {
  const newRequest = new RequestModel({
    name: '/',
    date: new Date()
  });
  newRequest.save((error: any, createdRequest: any) => {
    if (error) {
      console.log(error);
      res.status(500).send('Ups');
    } else {
      console.log('Saved');
      res.send(createdRequest);
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
