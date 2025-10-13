import express from 'express'
import { currentUser } from '@/controller/v1/user.controller'
import { authMiddleware } from '../../../middlewares/authMiddleware';
import { registerComplaint, getMyComplaints } from '@/controller/v1/complains.controller';

const userRouter = express.Router()

userRouter.get("/me", authMiddleware, currentUser);
// userRouter.post("/update-password", authMiddleware, updatePassword);
userRouter.post("/rgcomp", authMiddleware, registerComplaint);
userRouter.get("/mycomp", authMiddleware, getMyComplaints);

export default userRouter