import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => { 
    const { username, email, password } = req.body;

    if(!username || !password || !email || username === '' || password === '' || email === '') {
        next(errorHandler(400, "All fields are required"))
    }

    const hashedPassword = bcryptjs.hashSync(password);
    const newUser = new User({
        username, email, password: hashedPassword
    })

    try {
        await newUser.save();
        res.status(201).json('Signup successful');
    } catch (error) {
        next(error);
    }
}

export const signin = async (req, res, next) => {

}

export const google = async (req, res, next) => {

}