enum WalletStatus {
    active = 'active',
    inactive = 'inactive',
}

interface IWallet {
    account: number;
    balance: number;
    status: WalletStatus;
}

interface ILog {
    last_login: string;
    online: boolean;
}

export interface ICreateUser {
    id?: string;
    wallet?: IWallet;
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    logs?: ILog;
    created_at: string;
    updated_at: string;
}

export interface ILoginUser {
    _id?: string;
    id?: string;
    wallet?: IWallet;
    first_name: string;
    last_name: string;
    email: string;
    logs: ILog;
    token?: string;
    created_at: string;
    updated_at: string;
}

export interface ICreateWallet {
    account: number;
}
