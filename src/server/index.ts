import express from 'express';
import cors from 'cors';

import {WelcomeController} from './controllers';


const app: express.Application = express();
const PORT: number | string = process.env.PORT || 5000;

app.use(cors());
app.use('/welcome', WelcomeController);


app.listen(PORT, () => {
    console.log(`Server is up ${PORT}`);
});