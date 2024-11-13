import { Request, Response } from "express";
import { CreateUserSchema } from "../validations/user.validation";
import prisma from "../libs/prisma";
import { UserRole } from "../validations/user.validation";

export class UserController {
  private role: UserRole;
  constructor(role: UserRole) {
    this.role = role;

    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.getUser = this.getUser.bind(this);
  }

  async createUser(req: Request, res: Response) {
    try {
      const userData = CreateUserSchema.parse(req.body);
      const newUser = await prisma.user.create({
        data: { ...userData, role: this.role },
      });
      res.status(201).json({ success: true, data: newUser });
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userData = CreateUserSchema.partial().parse(req.body);
      const updatedUser = await prisma.user.update({
        where: { id, role: this.role },
        data: userData,
      });
      res
        .status(200)
        .json({ data: updatedUser, message: "Updated Successfully" });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.user.delete({
        where: { id, role: this.role },
      });
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getAllUsers(_: Request, res: Response) {
    try {
      const data = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address1: true,
          address2: true,
          pincode: true,
        },
        where: { role: this.role },
      });
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id, role: this.role },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address1: true,
          address2: true,
          pincode: true,
          role: true,
          age: true,
          hourlyRate: true,
        },
      });
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
