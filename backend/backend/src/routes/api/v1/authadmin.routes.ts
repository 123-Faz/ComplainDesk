import express from 'express'
import { all } from "../../../middlewares/trimRequestMiddleware"
import { login } from '@/controller/v1/admin/auth_admin.controller';
import { currentUser } from '@/controller/v1/admin/admin.controller';
const authAdminRouter = express.Router()


authAdminRouter.post('/login', all, login);
authAdminRouter.post('/me', all, currentUser);

export default authAdminRouter