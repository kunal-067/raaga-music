// src/models/Playlist.model.ts
// Mongoose model for user playlists
// Imports: mongoose for schema/model definition

import mongoose, { Document, Schema } from 'mongoose';

export interface IPlaylist extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  coverEmoji: string;
  coverImage?: string;
  ownerId: mongoose.Types.ObjectId;
  isPublic: boolean;
  trackIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PlaylistSchema = new Schema<IPlaylist>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 300 },
    coverEmoji: { type: String, default: '🎵' },
    coverImage: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isPublic: { type: Boolean, default: false },
    trackIds: { type: [String], default: [] },
  },
  { timestamps: true }
);

PlaylistSchema.index({ ownerId: 1, createdAt: -1 });

export const PlaylistModel =
  (mongoose.models.Playlist as mongoose.Model<IPlaylist>) ||
  mongoose.model<IPlaylist>('Playlist', PlaylistSchema);
