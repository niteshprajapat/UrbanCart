import express from 'express';
const router = express.Router();


import { validate } from '../middlewares/validate.js';
import { loginValidation, registerValidation } from '../validations/auth.validation.js';
import { register, login, verifyAccount } from '../controllers/auth.controller.js';


router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);
router.post("/verify-account", validate(loginValidation), verifyAccount);



export default router;