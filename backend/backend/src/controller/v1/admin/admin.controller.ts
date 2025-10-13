import { Request, Response, NextFunction } from "express"
import Admin from "@/models/Admin"
import { StatusCodes } from "@/modules/apiError.module"

export const currentUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {

        const admin = await Admin.findOne({ _id: req.user?.userId })

        return res.status(StatusCodes.OK).json(admin?.publicResponse())

    }
    catch (error) {
        next(error)
    }
}