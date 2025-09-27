import { Request, Response } from "express";
import { Op } from "sequelize";
import { Post, User } from "../models";
import {
  AuthenticatedRequest,
  CreateUserRequest,
  LoginRequest,
} from "../types";
import { generateToken } from "../utils/jwt";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
    }: CreateUserRequest = req.body;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      res.status(409).json({
        error: "User already exists with this email or username",
      });
      return;
    }

    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    res.status(201).json({
      message: "User created successfully",
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    // O errorHandler.ts cuidará de erros de validação do Sequelize
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    const user = await User.findOne({ where: { email } });

    // Combinando a verificação de usuário e senha em um bloco torna a lógica mais clara
    // e mantém uma resposta de erro genérica (que é importante por segurança)
    if (!user || !user.isActive || !(await user.validatePassword(password))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    res.status(200).json({
      message: "Login successful",
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      // Esta verificação é redundante se o middleware authenticateToken for usado
      // mas redundância é uma boa prática por questão de segurança
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }, // Garante que a senha não seja retornada
      include: [
        {
          model: Post,
          as: "posts",
          attributes: ["id", "title", "createdAt", "isPublished"],
          // imita e ordena os posts incluídos (+ performance)
          limit: 5,
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // A validação já foi feita pelo middleware, então podemos usar req.body com segurança.
    const { firstName, lastName, avatar } = req.body;

    await user.update({
      firstName,
      lastName,
      avatar,
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
