import Joi from 'joi';


export const registerValidation = Joi.object({
    fullName: Joi.string().min(2).max(50).trim().required().messages({
        "string.empty": "Full name is required",
        "any.required": "Full name is required",
    }),
    username: Joi.string().min(3).max(30).trim().lowercase().required().messages({
        "string.empty": "Username is required",
        "any.required": "Username is required",
    }),
    email: Joi.string().email().trim().lowercase().required().messages({
        "string.email": "Please provide a valid email",
        "any.required": "Email is required",
    }),
    phone: Joi.number().required().messages({
        "any.required": "Phone number is required",
    }),
    password: Joi.string(),
})