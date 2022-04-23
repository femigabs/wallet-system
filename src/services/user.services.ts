import { CreateUserDto } from '../dto/create-user.dto';
import { ICreateUser, ILoginUser } from '../interfaces/user.interface';
import { IUserService } from '../interfaces/user.service.interface';
import { Helper } from '../utils';
import { User } from '../models';

const { generateToken, generateRandomNumber } = Helper;

class UserService implements IUserService {
    async createUser(body: CreateUserDto): Promise<ICreateUser> {
        const { first_name, last_name, email, password: userPassword } = body;
        const hash = Helper.hashPassword(userPassword);
        const user = new User({ first_name, last_name, email, password: hash });
        const { id, created_at, updated_at, logs } = await user.save();
        return {
            id, first_name, last_name, email, logs, created_at, updated_at
        };
    };

    async loginUser(user: ILoginUser): Promise<ILoginUser> {
        const {
            _id: id, first_name, last_name, email, wallet
        } = user;

        const token = generateToken({
            id, first_name, last_name, email, account: wallet.account
        });

        const { logs, created_at, updated_at } = await User.findByIdAndUpdate(id,
            { logs: { last_login: new Date(), online: true }, updated_at: new Date() }, {
            new: true
        });        
        
        return {
            id, first_name, last_name, email, logs, wallet, created_at, updated_at, token
        }
    };

    async createWallet(id: string): Promise<ICreateUser> {
        const account = `102${generateRandomNumber(7)}`;
        const data = await User.findByIdAndUpdate(id, 
            { "wallet.account" : Number(account), updated_at: new Date() }, {
            new: true
        });
        const { first_name, last_name, email, logs, wallet, created_at, updated_at} = data;

        return {
            id, first_name, last_name, email, logs, wallet, created_at, updated_at
        }
    };

};

export default UserService;