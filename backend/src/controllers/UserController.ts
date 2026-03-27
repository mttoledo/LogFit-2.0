import { Request, Response } from "express";
import { User } from "../models/Users.js";
import logger from "../utils/logger.js";

export const registerUser = async (req: Request, res: Response) => {
  const { usuario, senha, idade, peso } = req.body;

  try {
    logger.info(`Tentativa de registro: ${usuario}`);

    const userExists = await User.findOne({ usuario });
    if (userExists) {
      logger.warn(`Usuário já existe: ${usuario}`);
      return res.status(400).json({ message: "Usuário já cadastrado." });
    }

    const newUser = new User({ usuario, senha, idade, peso });
    await newUser.save();

    logger.info(`Usuário criado: ${usuario}`);
    return res.status(201).json({ message: "Sucesso!" });
  } catch (error: any) {
    logger.error(`Erro: ${error.message}`);
    return res.status(500).json({ message: "Erro no servidor." });
  }
};
