import mongoose, { Schema, Document } from "mongoose";

export interface IFood extends Document {
  id: number;
  description: string;
  category: string;
  energy_kcal: mongoose.Schema.Types.Mixed;
}

const FoodSchema: Schema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    energy_kcal: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    collection: "foodlist",
  },
);

FoodSchema.index({ description: "text" });

export default mongoose.model<IFood>("FoodList", FoodSchema);
