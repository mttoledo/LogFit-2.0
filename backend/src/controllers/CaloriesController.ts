import { Request, Response } from "express";
import logger from "../utils/logger.js";
import CaloriesLog from "../models/CaloriesLog.js";
import jwt from "jsonwebtoken";
import FoodList from "../models/Food.js";

// Controller de busca do alimento
export const searchFood = async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q || typeof q !== "string") {
    return res
      .status(400)
      .json({ success: false, message: "Termo de busca inválido" });
  }

  try {
    const foods = await FoodList.find({
      description: { $regex: q, $options: "i" },
    })
      .limit(20)
      .lean();

    // Normalização para que energy_kcal seja sempre number
    const formattedFoods = foods.map((food) => ({
      _id: food._id,
      description: food.description,
      category: food.category,
      energy_kcal: isNaN(Number(food.energy_kcal))
        ? 0
        : Number(food.energy_kcal),
      baseUnit: "100g",
    }));

    res.status(200).json({ success: true, data: formattedFoods });
  } catch (error) {
    console.error("Erro na busca local:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro ao processar busca" });
  }
};

export const saveCaloriesLog = async (req: Request, res: Response) => {
  const { foodName, kcalPer100g, amount } = req.body;

  try {
    const totalKcal = (Number(kcalPer100g) * Number(amount)) / 100;

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
      userId: decoded.id,
      foodName,
      amount,
      kcalPer100g,
      totalKcal: Number(totalKcal.toFixed(2)),
      consumedAt: new Date(),
    });

    res.status(201).json({ success: true, data: newLog });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao salvar log" });
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

    const totalCalories = logs.reduce((acc, log) => acc + log.totalKcal, 0);

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
