import express from 'express'
import authRouter from './auth.routes'
import userRouter from './user.routes'
import authAdminRouter from './authadmin.routes'
import adminRouter from './admin.routes'
// import settingsRouter from './settings.route'

const v1Router = express.Router()

v1Router.use('/auth', authRouter)
v1Router.use('/auth_admin', authAdminRouter)
v1Router.use('/user', userRouter)
v1Router.use('/admin', adminRouter)
// v1Router.use('/settings', settingsRouter)

export default v1Router