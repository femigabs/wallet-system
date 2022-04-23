import request from 'supertest';
import nock from 'nock';
import app from '../../src';
import initiatePaymentResponse from '../mock/initiate.payment.response.json';
import { config } from '../../src/config';

const initializePaymentUrl = config.PAYSTACK_INITIALIZE_URL;

describe('User APIs', () => {
    let userToken1 = '';
    let userId1 = '';
    let userToken2 = '';
    let userId2 = '';
    let User1Account = '';
    let User2Account = '';
    describe('CREATE USER', () => {
        it('should create user1', (done) => {
            request(app)
                .post('/api/v1/user/signup')
                .set('Accept', 'application/json')
                .send({
                    email: "test1@gmail.com",
                    first_name: "test",
                    last_name: "user1",
                    password: "password"
                })
                .expect(201)
                .end((err, res) => {
                    expect(res.body.message).toEqual('User created successfully');
                    expect(res.body.code).toEqual(201);
                    done();
                });
        });

        it('should create user2', (done) => {
            request(app)
                .post('/api/v1/user/signup')
                .set('Accept', 'application/json')
                .send({
                    email: "test2@gmail.com",
                    first_name: "test",
                    last_name: "user1",
                    password: "password"
                })
                .expect(201)
                .end((err, res) => {
                    expect(res.body.message).toEqual('User created successfully');
                    expect(res.body.code).toEqual(201);
                    done();
                });
        });

        it('should throw error if email already exist', (done) => {
            request(app)
                .post('/api/v1/user/signup')
                .set('Accept', 'application/json')
                .send({
                    email: "test1@gmail.com",
                    first_name: "test",
                    last_name: "user1",
                    password: "password"
                })
                .expect(400)
                .end((err, res) => {
                    expect(res.body.message).toEqual('User exists already');
                    expect(res.body.code).toEqual(400);
                    done();
                });
        });
    });

    describe('LOGIN USER', () => {
        it('should login user1', (done) => {
            request(app)
                .post('/api/v1/user/login')
                .set('Accept', 'application/json')
                .send({
                    email: "test1@gmail.com",
                    password: "password"
                })
                .expect(200)
                .end((err, res) => {
                    userToken1 = res.body.data.token;
                    userId1 = res.body.data.id
                    expect(res.body.message).toEqual('User logged in successfully');
                    expect(res.body.code).toEqual(200);
                    done();
                });
        });

        it('should login user2', (done) => {
            request(app)
                .post('/api/v1/user/login')
                .set('Accept', 'application/json')
                .send({
                    email: "test2@gmail.com",
                    password: "password"
                })
                .expect(200)
                .end((err, res) => {
                    userToken2 = res.body.data.token;
                    userId2 = res.body.data.id
                    expect(res.body.message).toEqual('User logged in successfully');
                    expect(res.body.code).toEqual(200);
                    done();
                });
        });

        it('should throw error if email does not exist', (done) => {
            request(app)
                .post('/api/v1/user/login')
                .set('Accept', 'application/json')
                .send({
                    email: "test11@gmail.com",
                    password: "password"
                })
                .expect(400)
                .end((err, res) => {
                    expect(res.body.message).toEqual('User not found');
                    expect(res.body.code).toEqual(400);
                    done();
                });
        });

        it('should throw error if password is incorrect', (done) => {
            request(app)
                .post('/api/v1/user/login')
                .set('Accept', 'application/json')
                .send({
                    email: "test1@gmail.com",
                    password: "passworddd"
                })
                .expect(400)
                .end((err, res) => {
                    expect(res.body.message).toEqual('Invalid credentials');
                    expect(res.body.code).toEqual(400);
                    done();
                });
        });
    });

    describe('CREATE WALLET', () => {
        it('should create user1 wallet', (done) => {
            request(app)
                .patch(`/api/v1/user/${userId1}/wallet`)
                .set('Accept', 'application/json')
                .set('Authorization', userToken1)
                .expect(200)
                .end((err, res) => {
                    User1Account = res.body.data.wallet.account;
                    expect(res.body.message).toEqual('Wallet created successfully');
                    expect(res.body.code).toEqual(200);
                    done();
                });
        });

        it('should create user2 wallet', (done) => {
            request(app)
                .patch(`/api/v1/user/${userId1}/wallet`)
                .set('Accept', 'application/json')
                .set('Authorization', userToken2)
                .expect(200)
                .end((err, res) => {
                    User2Account = res.body.data.wallet.account;
                    expect(res.body.message).toEqual('Wallet created successfully');
                    expect(res.body.code).toEqual(200);
                    done();
                });
        });

        it('should throw error if user wallet already exist', (done) => {
            request(app)
                .patch(`/api/v1/user/${userId1}/wallet`)
                .set('Accept', 'application/json')
                .set('Authorization', userToken1)
                .expect(400)
                .end((err, res) => {
                    expect(res.body.message).toEqual('Wallet exists already');
                    expect(res.body.code).toEqual(400);
                    done();
                });
        });
    });

    describe('FUND WALLET', () => {
        it('should fund user1 wallet', (done) => {
            nock(initializePaymentUrl)
                .post('')
                .reply(200, initiatePaymentResponse);

            request(app)
                .post('/api/v1/wallet/fund')
                .set('Accept', 'application/json')
                .set('Authorization', userToken1)
                .send({
                    email: "test1@gmail.com",
                    amount: "300000"
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body.message).toEqual('Authorization URL created');
                    expect(res.body.code).toEqual(200);
                    done();
                });
        });

        it('should fund user1 wallet', (done) => {
            nock(initializePaymentUrl)
                .post('')
                .reply(200, initiatePaymentResponse);

            request(app)
                .post('/api/v1/wallet/fund')
                .set('Accept', 'application/json')
                .set('Authorization', userToken2)
                .send({
                    email: "test2@gmail.com",
                    amount: "500000"
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body.message).toEqual('Authorization URL created');
                    expect(res.body.code).toEqual(200);
                    done();
                });
        });
    });

    describe('TRANSFER  FUNDS', () => {
        it('should transfer funds', (done) => {
            request(app)
                .post(`/api/v1/wallet/transfer`)
                .set('Accept', 'application/json')
                .set('Authorization', userToken1)
                .send({
                    user_account: User1Account,
                    receiver_account: User2Account,
                    amount: "1000"
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body.message).toEqual('transfer was successful');
                    expect(res.body.code).toEqual(200);
                    done();
                });
        });

        it('should throw error if sender account does not exist', (done) => {
            request(app)
                .post(`/api/v1/user/wallet/transfer`)
                .set('Accept', 'application/json')
                .set('Authorization', userToken1)
                .send({
                    user_account: "1021468441",
                    receiver_account: User2Account,
                    amount: "1000"
                })
                .expect(400)
                .end((err, res) => {
                    expect(res.body.message).toEqual('Invalid user account number');
                    expect(res.body.code).toEqual(400);
                    done();
                });
        });

        it('should throw error if account is not associated ro user', (done) => {
            request(app)
                .post(`/api/v1/user/wallet/transfer`)
                .set('Accept', 'application/json')
                .set('Authorization', userToken1)
                .send({
                    user_account: User2Account,
                    receiver_account: User2Account,
                    amount: "1000"
                })
                .expect(400)
                .end((err, res) => {
                    expect(res.body.message).toEqual('Invalid user account number');
                    expect(res.body.code).toEqual(400);
                    done();
                });
        });

        it('should throw error if receiver account does not exist', (done) => {
            request(app)
                .post(`/api/v1/user/wallet/transfer`)
                .set('Accept', 'application/json')
                .set('Authorization', userToken1)
                .send({
                    user_account: User1Account,
                    receiver_account: "1021468441",
                    amount: "1000"
                })
                .expect(400)
                .end((err, res) => {
                    expect(res.body.message).toEqual('Invalid receiver account number');
                    expect(res.body.code).toEqual(400);
                    done();
                });
        });

        it('should throw error if amount is greater than balance', (done) => {
            request(app)
                .post(`/api/v1/user/wallet/transfer`)
                .set('Accept', 'application/json')
                .set('Authorization', userToken1)
                .send({
                    user_account: User1Account,
                    receiver_account: User2Account,
                    amount: "1000000"
                })
                .expect(400)
                .end((err, res) => {
                    expect(res.body.message).toEqual('Insufficient balance');
                    expect(res.body.code).toEqual(400);
                    done();
                });
        });
    });
});