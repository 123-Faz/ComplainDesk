// models/Complaint.ts
import { Schema, model, Document, ObjectId } from "mongoose";

export enum ComplaintStatus {
  PENDING = "pending",
  UNDER_REVIEW = "under_review",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  REJECTED = "rejected",
}

export interface IComplaint extends Document {
  user: ObjectId;            // user who created complaint
  title: string;
  description: string;
  status: ComplaintStatus;
  adminNotes?: string;
  attachments?: string[];
  assignedTo?: ObjectId;     // assigned admin
  priority?: "low" | "medium" | "high";
  comments?: {
    text: string;
    user: ObjectId;
    createdAt: Date;
  }[];
}

const complaintSchema = new Schema<IComplaint>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ComplaintStatus),
      default: ComplaintStatus.PENDING,
    },
    adminNotes: { type: String },
    attachments: [String],

    // 👇 new fields
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "Admin", // or "User" if users can handle complaints
      default: null,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    comments: [
      {
        text: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default model<IComplaint>("Complaint", complaintSchema);
