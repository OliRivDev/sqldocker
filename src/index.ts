import express from 'express';
const app = express();
const port = 8080;

app.get('/', (req: any, res: any) => {
  res.send(
    'Hello Wjhgjjjjjjjjjjjhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhorld....'
  );
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
