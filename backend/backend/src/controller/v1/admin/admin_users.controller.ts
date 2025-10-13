// src/controller/v1/admin/admin_users.controller.ts
import { Request, Response, NextFunction } from "express";
import ApiError, { StatusCodes } from "@/modules/apiError.module";
import User from '@/models/User';
import Complaint from '@/models/Complains';
import { Role } from "@/types/model.types";

// Get all users
export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const users = await User.find({})
            .select('-password -password_reset_token -suspanding_reasons')
            .sort({ createdAt: -1 });

        // Get complaint counts for each user
        const usersWithComplaintCount = await Promise.all(
            users.map(async (user) => {
                const complaintCount = await Complaint.countDocuments({ user: user._id });
                return {
                    ...user.toObject(),
                    complaintCount,
                    status: user.status ? 'active' : 'inactive'
                };
            })
        );

        return res.status(StatusCodes.OK).json(usersWithComplaintCount);
    } catch (error) {
        next(error);
    }
};

// Update user
export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id, name, email, username, role, status } = req.body;

        if (!id) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "User ID is required",
            });
        }

        // Check if email is already taken
        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: id } });
            if (existingUser) {
                return res.status(StatusCodes.CONFLICT).json({
                    message: "Email is already taken by another user",
                });
            }
        }

        // Check if username is already taken
        if (username) {
            const existingUser = await User.findOne({ username, _id: { $ne: id } });
            if (existingUser) {
                return res.status(StatusCodes.CONFLICT).json({
                    message: "Username is already taken by another user",
                });
            }
        }

        // Convert status string to boolean
        const statusBoolean = status === 'active';

        const updateData: any = {
            name,
            email,
            username,
            updatedAt: new Date()
        };

        // Only update role if provided
        if (role && Object.values(Role).includes(role)) {
            updateData.role = role;
        }

        // Only update status if provided
        if (status !== undefined) {
            updateData.status = statusBoolean;
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).select('-password -password_reset_token -suspanding_reasons');

        if (!updatedUser) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "User not found",
            });
        }

        return res.status(StatusCodes.OK).json({
            message: "User updated successfully",
            user: {
                ...updatedUser.toObject(),
                status: updatedUser.status ? 'active' : 'inactive'
            }
        });
    } catch (error: any) {
        if (error.name === "CastError") {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Invalid user ID format",
            });
        }
        next(error);
    }
};

// Delete user
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "User ID is required",
            });
        }

        // Check if user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "User not found",
            });
        }

        // Check if user has complaints
        const complaintCount = await Complaint.countDocuments({ user: id });
        if (complaintCount > 0) {
            return res.status(StatusCodes.CONFLICT).json({
                message: `Cannot delete user with ${complaintCount} complaints. Please delete complaints first.`,
            });
        }

        // Delete user
        await User.deleteOne({ _id: id });

        return res.status(StatusCodes.OK).json({
            message: "User deleted successfully",
            deletedUser: {
                id: user._id,
                name: user.name,
                email: user.email
            },
        });
    } catch (error: any) {
        if (error.name === "CastError") {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Invalid user ID format",
            });
        }
        next(error);
    }
};

// Get user stats (optional - for frontend display)
export const getUserStats = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ status: true });
        const inactiveUsers = await User.countDocuments({ status: false });
        const adminUsers = await User.countDocuments({ role: Role.admin });

        return res.status(StatusCodes.OK).json({
            total: totalUsers,
            active: activeUsers,
            inactive: inactiveUsers,
            admins: adminUsers
        });
    } catch (error) {
        next(error);
    }
};