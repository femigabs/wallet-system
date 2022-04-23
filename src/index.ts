import express from 'express';
import { appConfig, config, Logger } from './config';
import { constants } from './utils';
import { connect } from './config/database';

const {
    WALLET_SYSTEM_RUNNING
} = constants;

const app = express();
const port = config.PORT || 3100;

const logger = Logger.createLogger({ label: 'WALLET SYSTEM' });

appConfig(app);

connect();

app.listen(port, () => {
    logger.info(`${WALLET_SYSTEM_RUNNING} ${port}`);
});

export default app;
