import mongoose, { Schema, Document } from "mongoose";

export interface IWaterLog extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  consumedAt: Date;
}

const WaterLogSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "O ID do usuário é obrigatório"],
    },
    amount: {
      type: Number,
      required: [true, "A quantidade em ml é obrigatória"],
      min: [1, "A quantidade mínima para registro é de 1ml"],
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

WaterLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export default mongoose.model<IWaterLog>("WaterLog", WaterLogSchema);
