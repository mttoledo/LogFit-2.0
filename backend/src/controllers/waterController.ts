import { Request, Response } from "express";
import logger from "../utils/logger.js";
import WaterLog from "../models/WaterLog.js";

export const addWaterLog = async (req: Request, res: Response) => {
  try {
    const { amount, userId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantidade inválida. Insira um valor maior que zero",
      });
    }

    const newLog = await WaterLog.create({
      amount,
      userId,
    });
    logger.info(`Log de água registrado: ${amount}ml para o usuário ${userId}`);

    return res.status(201).json({
      success: true,
      data: newLog,
    });
  } catch (e: any) {
    logger.error(`Erro ao salvar log de água: ${e.message}`);

    return res.status(500).json({
      success: false,
      message: "Erro interno no servidor ao tentar salvar os dados.",
    });
  }
};

export const getWaterLogs = async (req: Request, res: Response) => {
  try {
    const logs = await WaterLog.find().sort({ createdAt: -1 });

    logger.info(`Logs de água recuperados com sucesso. Total: ${logs.length}`);

    return res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (e: any) {
    logger.error(`Erro ao buscar logs de água: ${e.message}`);

    return res.status(500).json({
      success: false,
      message: "Erro ao buscar histórico de água.",
    });
  }
};
