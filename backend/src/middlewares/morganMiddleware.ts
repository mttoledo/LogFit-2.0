import morgan from "morgan";
import logger from "../utils/logger.js";

// Redirecionamento do Morgan para o Winston
const stream = {
  write: (message: string) => logger.info(message.trim()),
};

// Filtragem das requisições em produção
const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development";
};

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream, skip },
);

export default morganMiddleware;
