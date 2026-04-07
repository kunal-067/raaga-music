// src/models/Track.model.ts
// Mongoose model caching YouTube track metadata to reduce API calls
// Imports: mongoose for schema/model definition

import mongoose, { Document, Schema } from 'mongoose';

export interface ITrack extends Document {
  youtubeId: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration?: number;
  genre?: string;
  album?: string;
  cachedAt: Date;
}

const TrackSchema = new Schema<ITrack>({
  youtubeId: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  artist: { type: String, required: true },
  thumbnail: { type: String, required: true },
  duration: { type: Number },
  genre: { type: String },
  album: { type: String },
  cachedAt: { type: Date, default: Date.now },
});

export const TrackModel =
  (mongoose.models.Track as mongoose.Model<ITrack>) ||
  mongoose.model<ITrack>('Track', TrackSchema);
