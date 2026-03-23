import waterRoutes from "./routes/waterRoutes.js";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "./utils/logger.js";
import morganMiddleware from "./middlewares/morganMiddleware.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());

// Middlewares
app.use(express.json());
app.use(morganMiddleware);

// Roteamento
app.use("/api/water", waterRoutes);

// Conexão com o MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  logger.error("ERRO: MONGODB_URI não definido no arquivo .env");
  process.exit(1);
}

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI!);
    logger.info("Conectado ao servidor Atlas com sucesso");
  } catch (e: any) {
    logger.error(`Erro ao conectar ao MongoDB: ${e.message}`);
    process.exit(1);
  }
}

connectDB();

app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});
