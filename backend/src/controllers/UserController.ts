import { Request, Response } from "express";
import { User } from "../models/Users.js";
import logger from "../utils/logger.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

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

export const handleLogin = async (req: Request, res: Response) => {
  try {
    const { usuario, senha, manterConectado } = req.body;
    const user = await User.findOne({ usuario });

    if (!user) {
      return res.status(401).json({ message: "Usuário ou senha incorretos" });
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Usuário ou senha incorretos" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "chave_muito_secreta_1_2_1_2_2",
      { expiresIn: manterConectado ? "7d" : "1d" },
    );

    const expiresIn = manterConectado ? 7 * 24 * 60 * 60 * 1000 : undefined;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expiresIn,
    });

    return res.status(200).json({
      message: "Login bem-sucedido!",
      user: {
        id: user._id,
        usuario: user.usuario,
      },
    });
  } catch (error: any) {
    logger.error(`Erro: ${error.message}`);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Sessão expirada. Faça login novamente." });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "chave_muito_secreta_1_2_1_2_2",
    ) as { id: string };

    const user = await User.findById(decoded.id).select("-senha");

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    return res.status(200).json(user);
  } catch (error: any) {
    logger.error(`Erro no getMe: ${error.message}`);
    return res.status(401).json({ message: "Token inválido." });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return res.status(200).json({ message: "Logout efetuado com sucesso." });
};
