import express from 'express';
import { registerUser, loginUser, sendEmail } from '../controllers/UserController';

const router = express.Router();

router.post('/users/register', registerUser);
router.post('/users/login', loginUser);
router.post('/users/sendEmail', sendEmail);

export default router;
