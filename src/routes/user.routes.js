import express from 'express';
const router = express.Router();

import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { changePassword, meProfile, updateProfile } from '../controllers/user.controller.js';


router.get("/me", isAuthenticated, meProfile);
router.put("/update-profile", isAuthenticated, updateProfile);
router.put("/change-password", isAuthenticated, changePassword);


export default router;