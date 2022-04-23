import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models';
import { Helper, genericErrors, ApiError, constants, DBError } from '../utils';
import { config } from '../config';

const { errorResponse, verifyPassword, moduleErrLogMessager } = Helper;

class AuthMiddleware {
    static async checkIfEmailAlreadyExist(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });
            if (user) {
                return errorResponse(
                    req,
                    res,
                    new ApiError({ message: constants.RESOURCE_ALREADY_EXIST('User'), status: 400 })
                );
            };
            return next();
        } catch (error) {
            return errorResponse(req, res, genericErrors.serverError);
        }
    };

    static async checkIfEmailExist(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return errorResponse(
                    req,
                    res,
                    new ApiError({ message: constants.RESOURCE_NOT_FOUND('User'), status: 404 })
                );
            };
            req.user = user;
            return next();
        } catch (error) {
            return errorResponse(req, res, genericErrors.serverError);
        }
    };

    static async comparePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { body } = req;
            const { user } = req;
            if (!verifyPassword(body.password, user.password)) {
                return errorResponse(
                    req,
                    res,
                    genericErrors.invalidCredential
                );
            }
            const { password, ...newUser } = user;
            req.user = newUser;
            return next();
        } catch (error) {
            return errorResponse(req, res, genericErrors.serverError);
        }
    };

    static async checkIfIdExist(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const user = await User.findById(id);
            const { id: tokenId } = req.decoded;
            if (!user) {
                return errorResponse(
                    req,
                    res,
                    new ApiError({ message: constants.RESOURCE_NOT_FOUND('User'), status: 404 })
                );
            };
            if (id !== tokenId) {
                return errorResponse(req, res, genericErrors.authRequired);
            };
            req.user = user;
            return next();
        } catch (error) {
            const dbError = new DBError({
                status: constants.RESOURCE_FETCH_ERROR_STATUS('USER'),
                message: error.message,
            });
            moduleErrLogMessager(dbError);
            return errorResponse(req, res, genericErrors.serverError);
        }
    };

    static async checkIfWalletExist(req: Request, res: Response, next: NextFunction) {
        try {
            const { wallet } = req.user;
            if (wallet?.account) {
                return errorResponse(
                    req,
                    res,
                    new ApiError({ message: constants.RESOURCE_ALREADY_EXIST('Wallet'), status: 400 })
                );
            };
            return next();
        } catch (error) {
            return errorResponse(req, res, genericErrors.serverError);
        }
    };

    static checkAuthorizationToken(authorization: string) {
        let bearerToken = null;
        if (authorization) {
            const token = authorization.split(' ')[1];
            bearerToken = (authorization.includes('Bearer')) ? token : authorization;
        }
        return bearerToken;
    };

    static userAuth = (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                headers: { authorization },
            } = req;

            const bearerToken = this.checkAuthorizationToken(authorization);
            if (!bearerToken) {
                return errorResponse(req, res, genericErrors.authRequired);
            }
            const decoded = jwt.verify(bearerToken, config.JWT_SECRET);
            req.decoded = decoded;
            req.decoded.token = bearerToken;
            return next();
        } catch (error) {
            return errorResponse(req, res, genericErrors.authRequired);
        }
    };

    static checkIfAccountExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user_account, receiver_account } = req.body;
            const { account } = req.decoded;
            const senderWallet = await User.findOne({ "wallet.account": user_account });
            const receiverWallet = await User.findOne({ "wallet.account": receiver_account });
            if (!senderWallet) {
                return errorResponse(
                    req,
                    res,
                    new ApiError({ message: 'Invalid user account number', status: 400 })
                );
            }
            if (Number(account) !== Number(user_account)) {
                return errorResponse(
                    req,
                    res,
                    new ApiError({ message: 'Account not associated to user', status: 400 })
                );
            }
            if (!receiverWallet) {
                return errorResponse(
                    req,
                    res,
                    new ApiError({ message: 'Invalid receiver account number', status: 400 })
                );
            }
            return next();
        } catch (error) {
            return errorResponse(req, res, genericErrors.serverError);
        }
    };

    static validateBalance = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user_account, amount } = req.body;
            const { wallet } = await User.findOne({ "wallet.account": user_account });
            if (amount > wallet.balance) {
                return errorResponse(
                    req,
                    res,
                    new ApiError({ message: 'Insufficient balance', status: 400 })
                );
              }
            return next();
        } catch (error) {
            return errorResponse(req, res, genericErrors.serverError);
        }

    };
};

export default AuthMiddleware;