import express, { Express, Request, Response } from 'express';

import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8080;
const app: Express = express();


app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Hello from the TypeScript world!</h1>');
});

app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));