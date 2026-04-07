// src/models/ListeningHistory.model.ts
// Tracks what users listen to for personalised recommendations
// Imports: mongoose for schema/model definition

import mongoose, { Document, Schema } from 'mongoose';

export interface IListeningHistory extends Document {
  userId: mongoose.Types.ObjectId;
  youtubeId: string;
  playedAt: Date;
  genre?: string;
}

const ListeningHistorySchema = new Schema<IListeningHistory>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  youtubeId: { type: String, required: true },
  playedAt: { type: Date, default: Date.now },
  genre: { type: String },
});

ListeningHistorySchema.index({ userId: 1, playedAt: -1 });

export const ListeningHistoryModel =
  (mongoose.models.ListeningHistory as mongoose.Model<IListeningHistory>) ||
  mongoose.model<IListeningHistory>('ListeningHistory', ListeningHistorySchema);
