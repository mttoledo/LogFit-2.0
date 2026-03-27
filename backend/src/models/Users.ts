import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  usuario: string;
  senha: string;
  idade: number;
  peso: number;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  usuario: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  senha: {
    type: String,
    required: true,
  },
  idade: {
    type: Number,
    required: true,
  },
  peso: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware de Hash da senha
UserSchema.pre<IUser>("save", async function () {
  if (!this.isModified("senha")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
  } catch (err: any) {
    throw err;
  }
});

export const User = model<IUser>("User", UserSchema);
