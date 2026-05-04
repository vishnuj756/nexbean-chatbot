import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getProfile } from '../controller/userController.js';



const router = express.Router();
router.get('/user/profile', verifyToken, getProfile)


export default router;