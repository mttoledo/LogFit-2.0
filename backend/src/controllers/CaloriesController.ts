import { Request, Response } from "express";
import logger from "../utils/logger.js";
import CaloriesLog from "../models/CaloriesLog.js";
import jwt from "jsonwebtoken";
import { searchFood } from "../services/fatSecret.js";

export const handleSearch = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({
        success: false,
        message: "O termo de busca é obrigatório",
      });
    }

    const alimentos = await searchFood(q);

    return res.status(200).json({
      success: true,
      data: alimentos,
    });
  } catch (error: any) {
    logger.error(`Erro ao buscar alimentos ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar alimentos na base de dados",
    });
  }
};

export const addCaloriesLog = async (req: Request, res: Response) => {
  try {
    const { type, amount, unit, calories } = req.body;

    if (!type || !amount || !unit || !calories) {
      return res.status(400).json({
        success: false,
        message:
          "Dados incompletos: Alimento, peso, unidade e calorias são necessários.",
      });
    }

    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Não autorizado." });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "chave_muito_secreta_1_2_1_2_2",
    ) as { id: string };

    const newLog = await CaloriesLog.create({
      type,
      amount,
      unit,
      calories,
      userId: decoded.id,
    });

    logger.info(
      `Log de caloria registrado: ${amount}${unit} de ${type}, equivalente a ${calories} para o usuário ${decoded.id}`,
    );

    return res.status(201).json({
      success: true,
      data: newLog,
    });
  } catch (error: any) {
    logger.error(`Erro ao salvar log de calorias: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Erro interno no servidor ao tentar salvar os dados.",
    });
  }
};

export const getCaloriesLogs = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res
        .status(400)
        .json({ success: false, message: "Data é obrigatória." });
    }

    const token = req.cookies.token;
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "chave_muito_secreta_1_2_1_2_2",
    ) as { id: string };
    const userId = decoded.id;

    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const logs = await CaloriesLog.find({
      userId,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ createdAt: -1 });

    const totalCalories = logs.reduce((acc, log) => acc + log.calories, 0);

    return res.status(200).json({
      success: true,
      totalCalories,
      logs,
    });
  } catch (error: any) {
    logger.error(`Erro ao buscar logs de calorias: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Erro interno no servidor." });
  }
};
