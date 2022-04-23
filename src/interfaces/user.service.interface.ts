import { CreateUserDto } from '../dto/create-user.dto';
import { ICreateUser, ILoginUser } from './user.interface';

export interface IUserService {
  createUser(body: CreateUserDto): Promise<ICreateUser>;
  loginUser(body: ILoginUser): Promise<ILoginUser>;
  createWallet(id: string): Promise<ICreateUser>;
}