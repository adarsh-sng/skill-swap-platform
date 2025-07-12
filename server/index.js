import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/db.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js'
import swapRoutes from './routes/swap.routes.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', function (req, res) {
    res.send('Welcome to SkillSwap API');
})

app.use('/api/auth', authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/swaps', swapRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
  });
});
