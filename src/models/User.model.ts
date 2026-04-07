// src/models/User.model.ts
// Mongoose model for Raaga users
// Imports: mongoose for schema/model definition

import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  image?: string;
  passwordHash?: string;
  provider: 'google' | 'github' | 'credentials';
  likedSongIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    image: { type: String },
    passwordHash: { type: String },
    provider: { type: String, enum: ['google', 'github', 'credentials'], required: true },
    likedSongIds: { type: [String], default: [] },
  },
  { timestamps: true }
);

// UserSchema.index({ email: 1 });

export const UserModel =
  (mongoose.models?.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>('User', UserSchema);
