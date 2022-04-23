import Mongoose, { ConnectOptions } from 'mongoose';
import { config } from '..';
import Logger from '../logger';

const logger = Logger.createLogger({ label: 'WALLET SYSTEM' });

let database: Mongoose.Connection;

export const connect = () => {
  const url = config.DATABASE_URL;
  if (database) {
    return;
  }
  Mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);
  database = Mongoose.connection;
  database.once('open', async () => {
    logger.info('Connected to database successfully');
  });
  database.on('error', () => {
    logger.error('Error connecting to database');
  });
};

export const disconnect = () => {
  if (!database) {
    return;
  }
  Mongoose.disconnect();
};

export default Mongoose;