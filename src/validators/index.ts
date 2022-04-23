import { Request, Response, NextFunction } from 'express';
import { Helper, ApiError } from '../utils';

const { errorResponse } = Helper;

const baseValidator = async (
  schema:any, req: Request, res: Response, next: NextFunction, type: string
  ) => {
  try {
    const getReqType: Record<string, any>  = {
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
    };
    getReqType[type] = await schema.validateAsync(getReqType[type]);
    return next();
  } catch (error) {
    const err = new ApiError({
      status: 400,
      message: error.message.replace(/[\"]/gi, ''),
    });
    return errorResponse(req, res, err);
  }
};

export default baseValidator;
