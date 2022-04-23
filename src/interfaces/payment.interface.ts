interface IInitializePaymentData {
    authorization_url: string;
    access_code: string;
    reference: string;
}

export interface IInitializePayment {
    status: boolean;
    message: string;
    data:IInitializePaymentData | any;
}

export interface IPaymentWebhook {
    event: string;
    data: any;
}

