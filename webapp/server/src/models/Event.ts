import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  userId: string;
  connectionId: string;
  type: "login" | "logout";
  provider: string;
  accountName: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

const eventSchema = new Schema<IEvent>(
  {
    userId: { type: String, required: true }, // changed from ObjectId
    connectionId: { type: String, required: true }, // changed from ObjectId
    type: { type: String, enum: ["login", "logout"], required: true },
    provider: { type: String, required: true },
    accountName: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEvent>(
  "Event",
  eventSchema,
  "sessionActivities"
); // collection override
