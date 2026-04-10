import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  hostId: string;
  players: string[];
  status: string;
  wordPairId?: string;
  createdAt: Date;
}

const SessionSchema: Schema = new Schema({
  hostId: { type: String, required: true },
  players: [{ type: String }],
  status: { type: String, required: true, default: 'lobby' },
  wordPairId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Session = mongoose.model<ISession>('Session', SessionSchema);
