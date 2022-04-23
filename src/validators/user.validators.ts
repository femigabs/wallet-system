import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';
import baseValidator from '.';

export const createUser = async ( req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().trim().lowercase().email()
      .required(),
    first_name: Joi.string().trim().lowercase().required(),
    last_name: Joi.string().trim().lowercase().required(),
    password: Joi.string().trim().max(20).required(),
  });
  await baseValidator(schema, req, res, next, 'body');
};

export const login = async ( req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().trim().lowercase().email()
      .required(),
    password: Joi.string().trim().max(20).required(),
  });
  await baseValidator(schema, req, res, next, 'body');
};

export const validateId = async ( req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    id: Joi.string()
  });
  await baseValidator(schema, req, res, next, 'params');
};