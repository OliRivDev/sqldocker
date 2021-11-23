import express from 'express';
// import mongoose from 'mongoose';
import dotenv from 'dotenv';
import mssql, { ConnectionPool } from 'mssql';
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

const sqlConnectionConfig: mssql.config = {
  user: dbUser,
  password: dbPass,
  server: dbHost,
  database: database,
  options: {
    trustServerCertificate: true
  }
};

const sqlConnectionPool = new ConnectionPool(sqlConnectionConfig);

// const mongoConnectionUrl = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${database}`;

// const connectWithRetry = () => {
//   mongoose
//     .connect(mongoConnectionUrl)
//     .then(() => {
//       console.log('Were connected to MongoDb');
//     })
//     .catch((err) => {
//       console.log('Error connecting to Mongo', err);
//       setTimeout(connectWithRetry, 5000);
//     });
// };

// connectWithRetry();

app.get('/', async (req: any, res: any) => {
  //#region SQL Server
  const connection = await sqlConnectionPool.connect();
  const request = await sqlConnectionPool.request();
  request.input('routeName', mssql.VarChar(50), '/');
  request.input('requestDate', mssql.DateTime, new Date());
  try {
    const result = await request.query(
      `INSERT INTO [dbo].[requests]
        (name, date)
        VALUES
        (@routeName, @requestDate)
        `
    );
    console.log(result);
    res.send('Success');
  } catch (ex) {
    res.status(500).send(ex);
  }
  console.log('Happy monday');

  connection.close();
  //#endregion

  //#region MongoDb
  // const newRequest = new RequestModel({
  //   name: '/',
  //   date: new Date()
  // });
  // newRequest.save((error: any, createdRequest: any) => {
  //   if (error) {
  //     console.log(error);
  //     res.status(500).send('Ups');
  //   } else {
  //     console.log('Saved');
  //     res.send(createdRequest);
  //   }
  // });
  //#endregion
});

app.get('/requests', async (req: any, res: any) => {
  const connection = await sqlConnectionPool.connect();
  const result = await connection.query('SELECT * FROM requests');
  connection.close();
  res.send(result.recordsets);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
