import PaymentService from '../services/payment.services';
import { Request, Response, NextFunction } from 'express';
import { IPaymentService } from '../interfaces/payment.service.interface';
import { Helper, constants, DBError, ApiError } from '../utils';

const { successResponse, moduleErrLogMessager } = Helper;

class PaymentController {
    constructor(private readonly paymentService: IPaymentService) {
        this.paymentService = paymentService;
    }

    fundWallet = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.paymentService.initializePayment(req.body);
            return successResponse(
                res, data.message, 200, data.data,
            );
        } catch (error) {
            const dbError = new DBError({
                status: constants.RESOURCE_CREATE_ERROR_STATUS('PAYMENT'),
                message: error.message,
            });
            moduleErrLogMessager(dbError);
            next(new ApiError({ message: constants.CREATE_ERROR_MSG('payment') }));
        }
    };

    verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { reference } = req.params;
            const data = await this.paymentService.verifyPayment(reference);
            return successResponse(
                res, constants.PAYMENT_VERIFICATION, 200, data,
            );
        } catch (error) {
            const dbError = new DBError({
                status: constants.RESOURCE_CREATE_ERROR_STATUS('PAYMENT'),
                message: error.message,
            });
            moduleErrLogMessager(dbError);
            next(new ApiError({ message: constants.CREATE_ERROR_MSG('payment') }));
        }
    };

    paymentWebhook = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.paymentService.paymentWebhook(req.body, req.headers);
            return successResponse(
                res, constants.PAYMENT_SUCCESS, 200, data,
            );
        } catch (error) {
            const dbError = new DBError({
                status: constants.RESOURCE_CREATE_ERROR_STATUS('PAYMENT'),
                message: error.message,
            });
            moduleErrLogMessager(dbError);
            next(new ApiError({ message: constants.CREATE_ERROR_MSG('payment') }));
        }
    };

    transfer = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.paymentService.transfer(req.body);
            return successResponse(
                res, constants.TRANSFER_SUCCESS, 200, data,
            );
        } catch (error) {
            const dbError = new DBError({
                status: constants.RESOURCE_CREATE_ERROR_STATUS('TRANSFER'),
                message: error.message,
            });
            moduleErrLogMessager(dbError);
            next(new ApiError({ message: constants.CREATE_ERROR_MSG('transfer') }));
        }
    };
};

export default new PaymentController(new PaymentService());
