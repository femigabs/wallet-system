/* eslint-disable import/no-cycle */
import { Router } from 'express';
import UserRoute from './user.route';
import WalletRoute from './wallet.route';

const router = Router();

router.use('/user', UserRoute);
router.use('/wallet', WalletRoute)

export default router;
