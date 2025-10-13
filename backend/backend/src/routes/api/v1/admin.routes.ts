// src/routes/v1/admin.routes.ts
import express from 'express'
import { authAdminMiddleware } from '@/middlewares/authMiddleware';
import { currentUser } from '@/controller/v1/admin/admin.controller';
import {
    getAllComplaints,
    updateComplaintStatus,
    deleteComplaint,
    assignComplaint,
    addAdminNote
} from '@/controller/v1/admin/admin_complains.controller';

import {
    getAllUsers,
    updateUser,
    deleteUser,
    getUserStats,
} from '@/controller/v1/admin/admin_users.controller';

import {
    generateReports,
    getDashboardStats
} from '@/controller/v1/admin/admin_reports.controller';

const adminRouter = express.Router()

// Admin profile
adminRouter.get("/me", authAdminMiddleware, currentUser);

// Complaints
adminRouter.get("/complaints/get-all", authAdminMiddleware, getAllComplaints);
adminRouter.put("/complaints/update-status/:id", authAdminMiddleware, updateComplaintStatus);
adminRouter.delete("/complaints/delete/:id", authAdminMiddleware, deleteComplaint);
adminRouter.post("/assign", authAdminMiddleware,  assignComplaint);
adminRouter.post("/note", authAdminMiddleware,  addAdminNote);

// Users
adminRouter.get("/users/get-all", authAdminMiddleware, getAllUsers);
adminRouter.get("/users/stats", authAdminMiddleware, getUserStats);
adminRouter.post("/users/update", authAdminMiddleware, updateUser);
adminRouter.delete("/users/delete/:id", authAdminMiddleware, deleteUser);

// Reports
adminRouter.post("/reports/generate", authAdminMiddleware, generateReports);
adminRouter.get("/reports/dashboard-stats", authAdminMiddleware, getDashboardStats);

export default adminRouter