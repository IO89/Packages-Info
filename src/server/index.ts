
// Import everything from express and assign it to the express variable
import express from 'express';
import cors from 'cors';

// Import WelcomeController from controllers entry point
import {WelcomeController} from './controllers';

// Create a new express application instance
const app: express.Application = express();
// The port the express app will listen on
const PORT: number | string = process.env.PORT || 5000;

app.use(cors());

// Mount the WelcomeController at the /welcome route
app.use('/welcome', WelcomeController);

// Serve the application at the given port
app.listen(PORT, () => {
    // Success callback
    console.log(`Server is up ${PORT}`);
});