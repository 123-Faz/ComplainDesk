import express, { Request, Response, NextFunction } from 'express'
import ApiError, { StatusCodes } from '../../modules/apiError.module'
import lodash from 'lodash';
import Admin, { AdminRole } from '../../models/Admin'
import { hashPassword } from '../../modules/bcrypt.module'

const mainRouter = express.Router()


mainRouter.get('/', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        return res.status(StatusCodes.OK).json({ message: "Welcome to API Server" })
    }
    catch (error) {
        next(error)
    }
})


mainRouter.post('/admin-seeder', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { password } = req.query;
        if (!password)
            return res.status(StatusCodes.OK).json({ message: "Welcome to Role Seeder Route" })
        if (password !== '85694') {
            throw new ApiError('Incorrect Seeder Password', StatusCodes.UNAUTHORIZED);
        }

        const adminArray = [
            {
                username: "admin",
                email: "admin@example.com",
                password: "12345678",
                role: AdminRole.admin,
                status: true
            },
        ]

        if (adminArray.length > 0) {
            const adminWithHashedPassword = await Promise.all(
                adminArray.map(async admin => ({
                    ...admin,
                    password: await hashPassword(admin.password)
                }))
            )
            const createdAdmins = await Admin.insertMany(adminWithHashedPassword)
            return res.status(StatusCodes.CREATED).json(createdAdmins)
        }
        return res.status(StatusCodes.NOT_FOUND).json({ message: "No Admin Available in adminArray to be created" })
    }
    catch (error) {
        next(error)
    }
})

export default mainRouter