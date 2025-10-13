import { Request, Response, NextFunction } from "express";
import validator from "validator";
import ApiError, { StatusCodes } from "@/modules/apiError.module";
import Complaint from "@/models/Complains";


export const registerComplaint = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const errors: {
      title?: string;
      description?: string;
    } = {};
    const { title, description } = req.body;

    !title
      ? (errors.title = "Title Is Required")
      : !validator.isLength(title, { min: 3 })
      ? (errors.title = "Title length must be at least 3 characters")
      : null;

    !description
      ? (errors.description = "Description Is Required")
      : !validator.isLength(description, { min: 100 })
      ? (errors.description = "Description length must be at least 100 characters")
      : null;

    if (Object.keys(errors).length > 0) {
      throw new ApiError(JSON.stringify(errors), StatusCodes.BAD_REQUEST);
    }

    const complaint = await new Complaint({
      user: req.user.userId,
      title,
      description,
    }).save();
    return res.status(StatusCodes.CREATED).json(complaint);
  } catch (error) {
    next(error);
  }
};

export const getMyComplaints = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const complaint = await Complaint.find({ user: req.user.userId });
    return res.status(StatusCodes.OK).json(complaint);
  } catch (error) {
    next(error);
  }
};