// src/controller/v1/admin/admin_reports.controller.ts
import { Request, Response, NextFunction } from "express";
import ApiError, { StatusCodes } from '@/modules/apiError.module';
import User from '@/models/User';
import Complaint from '@/models/Complains';
import { Role } from "@/types/model.types";

// Generate reports based on type
export const generateReports = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { reportType, startDate, endDate } = req.body;

        if (!reportType) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Report type is required",
            });
        }

        let reportData;

        switch (reportType) {
            case 'users':
                reportData = await generateUserReport(startDate, endDate);
                break;
            case 'complaints':
                reportData = await generateComplaintReport(startDate, endDate);
                break;
            default:
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Invalid report type. Use 'users' or 'complaints'",
                });
        }

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Report generated successfully",
            report: reportData
        });
    } catch (error) {
        next(error);
    }
};

// User Report
const generateUserReport = async (startDate?: string, endDate?: string) => {
    const dateFilter = buildDateFilter(startDate, endDate);
    
    const users = await User.find(dateFilter)
        .select('name email username role status createdAt')
        .sort({ createdAt: -1 });

    // Get basic user stats
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status).length;
    const adminUsers = users.filter(user => user.role === Role.admin).length;
    const regularUsers = users.filter(user => user.role === Role.user).length;

    return {
        type: 'users',
        period: getPeriodText(startDate, endDate),
        summary: {
            totalUsers,
            activeUsers,
            inactiveUsers: totalUsers - activeUsers,
            adminUsers,
            regularUsers
        },
        users: users,
        generatedAt: new Date().toISOString()
    };
};

// Complaint Report
const generateComplaintReport = async (startDate?: string, endDate?: string) => {
    const dateFilter = buildDateFilter(startDate, endDate);
    
    const complaints = await Complaint.find(dateFilter)
        .populate('user', 'name email')
        .sort({ createdAt: -1 });

    // Basic complaint stats
    const totalComplaints = complaints.length;
    const pendingComplaints = complaints.filter(c => c.status === 'pending').length;
    const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;

    return {
        type: 'complaints',
        period: getPeriodText(startDate, endDate),
        summary: {
            totalComplaints,
            pendingComplaints,
            resolvedComplaints,
            resolutionRate: totalComplaints > 0 ? 
                (resolvedComplaints / totalComplaints * 100).toFixed(2) : 0
        },
        complaints: complaints,
        generatedAt: new Date().toISOString()
    };
};

// Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        // Get total counts
        const totalUsers = await User.countDocuments();
        const totalComplaints = await Complaint.countDocuments();
        const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });

        // Recent activity (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentUsers = await User.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        const recentComplaints = await Complaint.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        return res.status(StatusCodes.OK).json({
            success: true,
            stats: {
                totalUsers,
                totalComplaints,
                resolvedComplaints,
                recentUsers,
                recentComplaints,
                resolutionRate: totalComplaints > 0 ? 
                    (resolvedComplaints / totalComplaints * 100).toFixed(2) : 0
            }
        });
    } catch (error) {
        next(error);
    }
};

// Helper function to build date filter
const buildDateFilter = (startDate?: string, endDate?: string) => {
    const filter: any = {};
    
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    
    return filter;
};

// Helper function to format period text
const getPeriodText = (startDate?: string, endDate?: string) => {
    return {
        startDate: startDate || 'All time',
        endDate: endDate || 'Present'
    };
};