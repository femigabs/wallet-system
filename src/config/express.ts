/* eslint-disable import/no-cycle */
/* eslint-disable no-unused-vars */
import morgan from 'morgan';
import { json, urlencoded, Request, Response, NextFunction, Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiV1Routes from '../routes/v1';
import { Helper, genericErrors, constants } from '../utils';

const { errorResponse } = Helper;
const { notFoundApi } = genericErrors;
const {
  WELCOME,
  v1,
} = constants;

const appConfig = (app: any) => {
  app.use(json());
  app.use(urlencoded({ extended: false }));

  // Use helmet to secure Express headers
  app.use(helmet());
  app.disable('x-powered-by');
  app.use(cors());
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers',
      'Authorization, Origin, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });

  app.get('/', (req: Request, res: Response) => res.json({ message: WELCOME }));

  app.use(v1, apiV1Routes);

  // catch 404 and forward to error handler
  app.use((req: Request, res: Response, next: NextFunction) =>  next(notFoundApi));

  // error handlers
  // will print stacktrace
  app.use((err: any, req: Request, res: Response, next: NextFunction) => errorResponse(req, res, err));
};

export default appConfig;
