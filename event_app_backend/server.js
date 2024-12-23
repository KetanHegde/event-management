import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import eventRoutes from './routes/eventRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import attendeeRoutes from './routes/attendeeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use('/api/events', eventRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/attendees', attendeeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
 const error = new Error('Not Found');
 error.status = 404;
 next(error);
});

app.use((error, req, res, next) => {
 res.status(error.status || 500).json({
   message: error.message || 'Internal Server Error',
 });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
 console.log(`Server running on port ${port}`);
});