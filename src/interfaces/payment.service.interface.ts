import { PaymentDto, PaymentWebhookDto, TransferDto } from '../dto/create-payment.dto';
import { IInitializePayment } from './payment.interface';
import { ICreateUser } from './user.interface';

export interface IPaymentService {
    initializePayment(body: PaymentDto): Promise<IInitializePayment>;
    verifyPayment(reference: string): Promise<IInitializePayment>;
    paymentWebhook(body: PaymentWebhookDto, headers: any): any;
    transfer(body: TransferDto): Promise<ICreateUser>;
}