import { Router } from 'express';
import UserController from '../../controllers/user.controller';
import AuthMiddleware from '../../middlewares/auth.middleware';
import * as userValidator from '../../validators/user.validators';


const router = Router();

router.post(
  '/signup',
  userValidator.createUser,
  AuthMiddleware.checkIfEmailAlreadyExist,
  UserController.addUser
);

router.post(
  '/login',
  userValidator.login,
  AuthMiddleware.checkIfEmailExist,
  AuthMiddleware.comparePassword,
  UserController.loginUser
);

router.patch(
  '/:id/wallet',
  userValidator.validateId,
  AuthMiddleware.userAuth,
  AuthMiddleware.checkIfIdExist,
  AuthMiddleware.checkIfWalletExist,
  UserController.createWallet
);


export default router;