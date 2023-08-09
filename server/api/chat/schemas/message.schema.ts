import mongoose, { Schema } from 'mongoose';

export const MessageSchema = new mongoose.Schema(
    {
      content: { type: String },
      time: { type: Date },
      sender: { type: String }
    }
)
export class Message {
    content: string;
    time: Date;
    sender: string;
  }

