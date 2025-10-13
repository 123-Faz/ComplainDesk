import { NextFunction, Request, Response } from "express";
import validator from "validator"
import ApiError, { StatusCodes } from "@/modules/apiError.module";
import Admin from "@/models/Admin";
import { comparePassword } from "@/modules/bcrypt.module";


export const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const errors: {
            username?: string
            password?: string
        } = {}
        const { username, password } = req.body

        !username
            ? errors.username = "Username Is Required"
            : null
        !password
            ? errors.password = "Password Is Required"
            : null

        if (Object.keys(errors).length > 0) {
            throw new ApiError(errors, StatusCodes.BAD_REQUEST)
        }

        const queryParam: {
            username?: string,
            email?: string
        } = { username: username };

        if (validator.isEmail(username)) {
            queryParam.email = username
            delete queryParam['username']
        }

        const loginUser = await Admin.findOne(queryParam).select('+password')
        if (!loginUser)
            throw new ApiError('Invalid Credientials', StatusCodes.BAD_REQUEST);
        const passwordCheck = await comparePassword(password, loginUser!.password)
        if (!passwordCheck)
            throw new ApiError('Invalid Credientials', StatusCodes.BAD_REQUEST);


        const token = await loginUser.createAccessToken()


        return res.status(StatusCodes.OK).json({ message: "Login Success", access_token: token, user: loginUser.newUserResponse() })

    }
    catch (error) {
        next(error)
    }
}