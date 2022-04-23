import crypto from 'crypto';
import { config } from '../config';
import { PaymentDto, PaymentWebhookDto, TransferDto } from '../dto/create-payment.dto';
import { IInitializePayment } from '../interfaces/payment.interface';
import { Helper } from '../utils';
import Logger from '../config/logger';
import { User, Transaction } from '../models';
import { ICreateUser } from '../interfaces/user.interface';

const { generateRandomNumber } = Helper;

const logger = Logger.createLogger({ label: 'WALLET SYSTEM' })

const { makeRequest } = Helper;
const initializePaymentUrl = config.PAYSTACK_INITIALIZE_URL;
const verifyPaymentUrl = config.PAYSTACK_VERIFY_PAYMENT_URL
class PaymentService {
    async initializePayment(body: PaymentDto): Promise<IInitializePayment> {
        const options = {
            headers: {
                Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            data: body
        }
        const result = await makeRequest(
            initializePaymentUrl,
            'POST',
            options
        );
        return result;
    };

    async verifyPayment(reference: string): Promise<IInitializePayment> {
        const options = {
            headers: {
                Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
        };
        logger.info('Verifying Payment>>>')
        const result = await makeRequest(
            `${verifyPaymentUrl}/${reference}`,
            'GET',
            options
        );
        return result;
    };

    paymentWebhook = async (body: PaymentWebhookDto, headers: any) => {
        logger.info('Processing Webhook>>>')
        // validate event
        const hash = crypto.createHmac('sha512', config.PAYSTACK_SECRET_KEY).update(JSON.stringify(body))
            .digest('hex');
        if (hash === headers['x-paystack-signature']) {
            // Retrieve the request's body
            const {
                event, data
            } = body;
            logger.info('Processing Webhook>>>', data)
            const {
                amount, reference, customer
            } = data;
            if (event === 'charge.success') {
                const transaction_id = generateRandomNumber(10);
                const { data: verificationData } = await this.verifyPayment(reference);
                if (verificationData.status === 'success') {
                    logger.info(`Payment Verification successful for user - [${customer.email}] with reference - [${reference}]`);

                    const { wallet } = await User.findOne({ email: customer.email });

                    logger.info(`Fetched Info for user - [${customer.email}] Successfully`);

                    const newBalance = Number(wallet.balance) + Number(amount / 100);

                    await User.findOneAndUpdate({ email: customer.email }, {
                        "wallet.balance": Number(newBalance), updated_at: new Date()
                    });
                    logger.info(`Updated wallet balance for user - [${customer.email}] Successfully`)

                    const transaction = new Transaction({ 
                        user_account: wallet.account, 
                        amount: Number(amount / 100), 
                        transaction_id, 
                        payment_id: reference,
                        transaction_type: 'deposit',
                        status: 'success'
                    });
                    await transaction.save();
                    logger.info(`Transaction added for user - [${customer.email}] Successfully`)
                }
            }
        }
    };

    transfer = async (body: TransferDto): Promise<ICreateUser | any> => {
        const { user_account, receiver_account, amount } = body;
        const transaction_id = generateRandomNumber(10);
        const { wallet: senderWallet } = await User.findOne({ "wallet.account": user_account });
        const senderNewBalance = Number(senderWallet.balance) - Number(amount);

        const { wallet: receiverWallet } = await User.findOne({ "wallet.account": receiver_account });
        const receiverNewBalance = Number(receiverWallet.balance) + Number(amount);

        const sender = await User.findOneAndUpdate({ "wallet.account": user_account }, {
            "wallet.balance": Number(senderNewBalance), updated_at: new Date()
        }, { new: true });

        await User.updateOne({ "wallet.account": receiver_account }, {
            "wallet.balance": Number(receiverNewBalance), updated_at: new Date()
        });

        const transaction = new Transaction({ 
            user_account: senderWallet.account, 
            receiver_account: receiverWallet.account,
            amount, transaction_id, 
            transaction_type: 'transfer',
            status: 'success'
        });
        await transaction.save();

        const { id, first_name, last_name, email, logs, wallet, created_at, updated_at } = sender;

        return {
            id, first_name, last_name, email, logs, wallet, created_at, updated_at
        }
    };
}

export default PaymentService;