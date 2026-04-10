import mongoose, { Schema, Document } from 'mongoose';

export interface IAiWordBatch extends Document {
  batchSize: number;
  wordIds: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const AiWordBatchSchema: Schema = new Schema({
  batchSize: { type: Number, required: true },
  wordIds: [{ type: Schema.Types.ObjectId, ref: 'WordPair' }],
  createdAt: { type: Date, default: Date.now }
});

export const AiWordBatch = mongoose.model<IAiWordBatch>('AiWordBatch', AiWordBatchSchema);
