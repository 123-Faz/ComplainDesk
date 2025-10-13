import { Request, Response, NextFunction } from "express";
import ApiError, { StatusCodes } from "@/modules/apiError.module";
import Complaint from '@/models/Complains';

// Get all complaints with filtering by status and sorted by recent
export const getAllComplaints = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { status } = req.query;
        
        // Build filter object
        const filter: any = {};
        
        if (status && status !== 'all') {
            filter.status = status;
        }

        // Get complaints sorted by most recent first - ONLY populate user
        const complaints = await Complaint.find(filter)
            .populate('user', 'name email phone') // Only populate user, NOT assignedTo
            .sort({ createdAt: -1 });

        return res.status(StatusCodes.OK).json(complaints);
    } catch (error) {
        console.error("Error in getAllComplaints:", error);
        next(error);
    }
};

// Admin updates status
export const updateComplaintStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate ID
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Complaint ID is required",
      });
    }

    // Update complaint - ONLY populate user
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('user', 'name email phone'); // Only populate user, NOT assignedTo

    if (!updatedComplaint) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Complaint not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "Complaint status updated successfully",
      updatedComplaint: updatedComplaint
    });
  } catch (error: any) {
    if (error.name === "CastError") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid complaint ID format",
      });
    }
    next(error);
  }
};

export const deleteComplaint = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Complaint ID is required",
      });
    }

    // Check if complaint exists
    const db_complaint = await Complaint.findOne({ _id: id });

    if (!db_complaint) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Complaint not found",
      });
    }

    // Delete complaint
    await Complaint.deleteOne({ _id: id });

    return res.status(StatusCodes.OK).json({
      message: "Complaint deleted successfully",
      deletedComplaint: {
        id: db_complaint._id,
        title: db_complaint.title,
      },
    });
  } catch (error: any) {
    if (error.name === "CastError") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid complaint ID format",
      });
    }
    next(error);
  }
};

export const assignComplaint = async (req: Request, res: Response) => {
  try {
    const { complaintId, adminId } = req.body;

    const updated = await Complaint.findByIdAndUpdate(
      complaintId,
      { assignedTo: adminId, status: "in_progress" },
      { new: true }
    )
      .populate("user", "username email")
      .populate("assignedTo", "username email");

    if (!updated) return res.status(404).json({ error: "Complaint not found" });

    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Add admin note
export const addAdminNote = async (req: Request, res: Response) => {
  try {
    const { complaintId, note } = req.body;

    const updated = await Complaint.findByIdAndUpdate(
      complaintId,
      { adminNotes: note },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Complaint not found" });

    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};