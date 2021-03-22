import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';

import AppError from './Errors/AppError';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.status).json({
      status: 'error',
      code: err.status,
      message: err.message,
    });
  }

  console.log(err);

  return response.status(500).json({
    status: 'error',
    code: 500,
    message: 'Internal server error',
  });
});

app.listen(3333, () => console.log('Serve starded on port 3333'));

export default app;
