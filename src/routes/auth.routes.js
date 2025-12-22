import express from 'express';
const router = express.Router();


import { validate } from '../middlewares/validate.js';
import { loginValidation, registerValidation, resendVerificationTokenValidation, verifyAccountValidation } from '../validations/auth.validation.js';
import { register, login, verifyAccount, resendVerificationToken, forgotPassword, resetPassword, forgotPasswordWithLink, resetPassword2 } from '../controllers/auth.controller.js';


router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);
router.post("/verify-account", validate(verifyAccountValidation), verifyAccount);
router.post("/resend-verification-token", validate(resendVerificationTokenValidation), resendVerificationToken);
router.post("/forgot-password", forgotPassword);
router.post("/forgot-password2", forgotPasswordWithLink);
router.post("/reset-password", resetPassword);
router.post("/reset-password2", resetPassword2);



export default router;