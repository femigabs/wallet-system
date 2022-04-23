import { Router } from 'express';
import PaymentController from '../../controllers/payment.controller';
import AuthMiddleware from '../../middlewares/auth.middleware';
import * as paymentValidator from '../../validators/payment.validators';

const router = Router();

router.post(
    '/fund',
    paymentValidator.fundWallet,
    AuthMiddleware.userAuth,
    PaymentController.fundWallet
);

router.get(
    '/verify/:reference',
    paymentValidator.verifyPayment,
    AuthMiddleware.userAuth,
    PaymentController.verifyPayment
);

router.post(
    '/transfer',
    paymentValidator.transfer,
    AuthMiddleware.userAuth,
    AuthMiddleware.checkIfAccountExists,
    AuthMiddleware.validateBalance,
    PaymentController.transfer
);

// route to listen on paystack payment
router.post(
    '/payment/webhook',
    PaymentController.paymentWebhook
);

export default router;