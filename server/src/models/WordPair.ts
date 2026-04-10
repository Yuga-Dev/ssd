import mongoose, { Schema, Document } from 'mongoose';

export interface IWordPair extends Document {
  realWord: string;
  imposterWord: string;
  category: string;
  difficulty: string;
  relationship: string;
  used: boolean;
}

const WordPairSchema: Schema = new Schema({
  realWord: { type: String, required: true },
  imposterWord: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  relationship: { type: String, required: true },
  used: { type: Boolean, default: false }
});

export const WordPair = mongoose.model<IWordPair>('WordPair', WordPairSchema);
