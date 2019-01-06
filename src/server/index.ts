import express from 'express';
import cors from 'cors';

import {PackagesRoutes} from './routes';

const app: express.Application = express();
const PORT: number | string = process.env.PORT || 5000;

app.use(cors());
app.use('/packages',PackagesRoutes);

app.listen(PORT, () => {
    console.log(`Server is up ${PORT}`);
});