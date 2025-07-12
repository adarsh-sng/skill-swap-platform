import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', function (req, res) {
    res.send('Welcome to SkillSwap API');
})

app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`);
})