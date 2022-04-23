import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';
import baseValidator from '.';

export const fundWallet = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().trim().lowercase().email()
      .required(),
    amount: Joi.string().trim().lowercase().required(),
  });
  await baseValidator(schema, req, res, next, 'body');
};

export const verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    reference: Joi.string().required()
  });
  await baseValidator(schema, req, res, next, 'params');
};

export const transfer = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    user_account: Joi.number().required(),
    receiver_account: Joi.number().required(),
    amount: Joi.number().required(),
  });
  await baseValidator(schema, req, res, next, 'body');
};