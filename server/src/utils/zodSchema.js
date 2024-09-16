const { z } = require('zod');

const signUpSchema = z.object({
    username: z.string().min(1, { message: 'Username is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    cPassword: z.string().min(8, { message: 'Confirm Password must be at least 8 characters long' }),
}).refine((data) => data.password === data.cPassword, {
    message: "Passwords do not match",
    path: ['cPassword'],
});


const signInSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});


const forgotPasswordSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
});


const resetPasswordSchema = z.object({
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    cPassword: z.string().min(8, { message: 'Confirm Password must be at least 8 characters long' }),
}).refine((data) => data.password === data.cPassword, {
    message: "Passwords do not match",
    path: ['cPassword'],
});

module.exports = {
    signUpSchema,
    signInSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
};
