import express from 'express';
import { changePassword, forgotPassword, login, register } from '../controller/authController.js';
import { verifyToken } from '../middleware/auth.js';


const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/forgot-password',forgotPassword);
router.post('/auth/change-password',verifyToken,changePassword)

export default router;