export class PaymentDto {
    email: string;
    amount: Record<string, number>;
}

export class PaymentWebhookDto {
    event: string;
    data: any;
}

export class TransferDto {
    user_account: number;
    receiver_account: number;
    amount: number;
}