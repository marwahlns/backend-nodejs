import express from 'express';
import { registerUser, loginUser } from '../controllers/UserController';

const router = express.Router();

router.post('/users/register', registerUser);
router.post('/users/login', loginUser);

export default router;
