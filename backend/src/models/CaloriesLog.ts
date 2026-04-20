import mongoose, { Schema, Document } from "mongoose";

export interface ICaloriesLog extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  unit: string;
  amount: number;
  calories: number;
  consumedAt: Date;
}

const CaloriesLogSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "O ID do usuário é obrigatório"],
    },
    type: {
      type: String,
      required: [true, "O tipo de alimento é obrigatório"],
    },
    unit: {
      type: String,
      required: [true, "É necessário constar a unidade de medida"],
    },
    amount: {
      type: Number,
      required: [true, "A quantidade em g é obrigatória"],
      min: [1, "A quantidade mínima para registro é de 1g"],
    },
    calories: {
      type: Number,
      required: [true, "O cálculo de calorias é obrigatório"],
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
