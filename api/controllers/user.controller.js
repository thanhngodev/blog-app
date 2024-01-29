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
  try {
    res
      .clearCookie('access_token')
      .status(200)
      .json('User has been signed out');
  } catch (error) {
    next(error);
  }
}

export const getUsers = async (req, res, next) => {

}

export const getUser = async (req, res, next) => {

}