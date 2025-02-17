import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController';

const router = express.Router();

router.get('/profile/:id', getProfile);
router.put('/profile/:id', updateProfile);

export default router; 