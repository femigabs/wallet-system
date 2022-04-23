import UserService from '../services/user.services';
import { Request, Response, NextFunction } from 'express';
import { IUserService } from '../interfaces/user.service.interface';
import { Helper, constants, DBError, ApiError } from '../utils';

const { successResponse, moduleErrLogMessager } = Helper;

class UserController {
    constructor(private readonly userService: IUserService) {
        this.userService = userService;
    }

    addUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.userService.createUser(req.body);
            return successResponse(
                res, constants.CREATE_SUCCESS('User'), 201, data,
            );
        } catch (error) {
            const dbError = new DBError({
                status: constants.RESOURCE_CREATE_ERROR_STATUS('USER'),
                message: error.message,
            });
            moduleErrLogMessager(dbError);
            next(new ApiError({ message: constants.CREATE_ERROR_MSG('user') }));
        }
    };

    loginUser = async (req: Request, res: Response, next: NextFunction) => {
        try {                 
            const data = await this.userService.loginUser(req.user._doc);
            return successResponse(res, constants.LOGIN_USER, 200, data);
        } catch (error) {
            const dbError = new DBError({
                status: constants.RESOURCE_CREATE_ERROR_STATUS('USER'),
                message: error.message,
            });
            moduleErrLogMessager(dbError);
            next(new ApiError({ message: constants.CREATE_ERROR_MSG('user') }));
        }
    };

    createWallet = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data = await this.userService.createWallet(id);
            return successResponse(
                res, constants.CREATE_SUCCESS('Wallet'), 200, data,
            );
        } catch (error) {
            const dbError = new DBError({
                status: constants.RESOURCE_CREATE_ERROR_STATUS('WALLET'),
                message: error.message,
            });
            moduleErrLogMessager(dbError);
            next(new ApiError({ message: constants.CREATE_ERROR_MSG('wallet') }));
        }
    };
};

export default new UserController(new UserService());
