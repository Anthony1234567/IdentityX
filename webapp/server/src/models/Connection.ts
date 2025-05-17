// models/Connection.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IConnection extends Document {
  userId: string;
  provider: string;
  accountName: string;
}

const ConnectionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: String, required: true },
    accountName: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IConnection>("Connection", ConnectionSchema);
