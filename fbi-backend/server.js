import express from 'express';
import cors from 'cors';
import { fbiWantedRoutes } from './routes/fbi_wanted.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/fbiwanted',fbiWantedRoutes())

const port = process.env.PORT || 4000;

app.listen(port, ()=>{
    console.log(`Server is running on port  ${port}`);
});
