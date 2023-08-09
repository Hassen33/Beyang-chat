import { Message, MessageSchema } from "./message.schema";
import mongoose, { Schema } from 'mongoose';
import { User } from "src/api/users/models/user.model";

export const ChatSchema = new mongoose.Schema(
    {
      from: { type: String},
      to: { type: String},
      messages: [{ type: MessageSchema }],
      reletedTo: { type: Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true },
)
export class Chat {
    from: string;
    to: string;
    messages: [Message];
  }
 

