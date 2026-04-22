import mongoose, { Schema, Document } from "mongoose";

export interface ICaloriesLog extends Document {
  userId: mongoose.Types.ObjectId;
  foodName: string;
  amount: number;
  kcalPer100g: number;
  totalKcal: number;
  consumedAt: Date;
}

const CaloriesLogSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "O ID do usuário é obrigatório"],
    },
    foodName: {
      type: String,
      required: [true, "O nome do alimento é obrigatório"],
    },
    amount: {
      type: Number,
      required: [true, "A quantidade em g é obrigatória"],
      min: [1, "A quantidade mínima para registro é de 1g"],
    },
    kcalPer100g: {
      type: Number,
      required: [true, "O cálculo de calorias é obrigatório"],
    },
    totalKcal: {
      type: Number,
      required: [true, "O total de calorias é obrigatório"],
    },
    consumedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

CaloriesLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export default mongoose.model<ICaloriesLog>("CaloriesLog", CaloriesLogSchema);
