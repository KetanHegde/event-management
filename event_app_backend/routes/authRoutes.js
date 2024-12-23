import express from 'express';
import { loginUser, registerUser } from '../controllers/authController.js';

const router = express.Router();

// Login route
router.post('/login', loginUser);
router.post('/register', registerUser);

export default router;
