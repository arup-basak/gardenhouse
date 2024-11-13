import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../libs/prisma";
import bcrypt from "bcrypt";
import { loginSchema } from "../validations/auth.validation";

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const data = loginSchema.parse(req.body);
      console.log(data);

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
        return;
      }

      // Check password
      const validPassword = await bcrypt.compare(data.password, user.password);
      if (!validPassword) {
        res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
        return;
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
      );

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
      });
      return;
    } catch (error) {
      res.status(400).json({ error });
      return;
    }
  }

  async me(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user?.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      res.json({
        success: true,
        data: user,
      });
      return;
    } catch (error) {
      res.status(400).json({ error });
      return;
    }
  }
}
