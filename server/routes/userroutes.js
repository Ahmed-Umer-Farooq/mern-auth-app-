import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUser } from '../controllers/usercontroller.js';

const userrouter = express.Router();

userrouter.get('/data', userAuth, getUser);

export default userrouter;