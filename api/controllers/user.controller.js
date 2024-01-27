import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';

export const test = (req, res) => {
  res.json({ message: 'API is working!' });
};


export const updateUser = async (req, res, next) => {

}

export const deleteUser = async (req, res, next) => { 

}

export const signout = (req, res, next) => {

}

export const getUsers = async (req, res, next) => {

}

export const getUser = async (req, res, next) => {
    
}