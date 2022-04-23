import crypto from 'crypto';
import bcrypt from 'bcrypt';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import genericError from '../error/generic';
import constants from '../constants';
import { config } from '../../config';
import Logger from '../../config/logger';
import ModuleError from '../error/module.error';

const logger = Logger.createLogger({ label: 'WALLET-SYSTEM' });

const { serverError } = genericError;
const { FAIL } = constants;
const secret = config.JWT_SECRET;
const expiry = config.JWT_EXPIRY_DURATION;

/**
 *Contains Helper methods
 * @class Helper
 */
class Helper {
  /**
   * Generates a JSON response for failure scenarios.
   * @static
   * @param {Request} req - Request object.
   * @param {Response} res - Response object.
   * @param {object} error - The error object.
   * @param {number} error.status -  HTTP Status code, default is 500.
   * @param {string} error.message -  Error message.
   * @param {object|array} error.errors -  A collection of  error message.
   * @memberof Helpers
   * @returns {JSON} - A JSON failure response.
   */
  static errorResponse(req: Request, res: Response, error: any) {
    const aggregateError = { ...serverError, ...error };
    Helper.apiErrLogMessager(aggregateError, req);
    return res.status(aggregateError.status).json({
      status: FAIL,
      message: aggregateError.message,
      errors: aggregateError.errors
    });
  }

  /**
   * Generates log for api errors.
   * @static
   * @param {object} error - The API error object.
   * @param {Request} req - Request object.
   * @memberof Helpers
   * @returns {String} - It returns null.
   */
  static apiErrLogMessager(error: any, req: Request) {
    logger.error(
      `${error.name} - ${error.status} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
  }

  static moduleErrLogMessager = (error: any) => logger.error(`${error.status} - ${error.name} - ${error.message}`);

  static successResponse = (res: Response, message: string, code: number, data: any) => {
    return res.status(code).json({
      message,
      code,
      data,
    });
  };

  static generateRandomNumber(size: number) {
    let code = '';
    code += crypto.randomBytes(256).readUIntBE(0, 6);
    return Number.parseInt(code.slice(0, size), 10);
  }



  static hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  };

  static verifyPassword(password: string, hashedPassword: string) {
    const validPassword = bcrypt.compareSync(password, hashedPassword);
    if (validPassword) {
      return true;
    }
    return false;
  };

  static generateToken(payload: any) {
    return jwt.sign(payload, secret, { expiresIn: expiry });
  };

  static async makeRequest(url: string, method: any, options = {}) {
    try {
      const { data } = await axios({ url, method, ...options });
      logger.info('Request processed successfully');
      return data;
    } catch (error) {
      const status = error.response ? error.response.status : 500;
      const moduleError = new ModuleError({ message: error.message, status });
      this.moduleErrLogMessager(moduleError);
      throw moduleError;
    }
  };
}

export default Helper;
