import mongoose, { Schema, Document } from 'mongoose';

export interface IPlayer extends Document {
  displayName: string;
  deviceId: string;
  isOnline: boolean;
}

const PlayerSchema: Schema = new Schema({
  displayName: { type: String, required: true },
  deviceId: { type: String, required: true, unique: true },
  isOnline: { type: Boolean, default: false }
});

export const Player = mongoose.model<IPlayer>('Player', PlayerSchema);
