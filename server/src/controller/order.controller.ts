import { Request, Response } from "express";
import { CreateOrderSchema } from "../validations/order.validation";
import prisma from "../libs/prisma";

export class OrderController {
  constructor() {
    this.createOrder = this.createOrder.bind(this);
    this.getAllOrders = this.getAllOrders.bind(this);
    this.getOrder = this.getOrder.bind(this);
    this.updateOrderStatus = this.updateOrderStatus.bind(this);
  }

  async createOrder(req: Request, res: Response) {
    try {
      const orderData = CreateOrderSchema.parse(req.body);
      const newOrder = await prisma.order.create({
        data: orderData,
      });
      res.status(201).json({ success: true, data: newOrder });
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  async updateOrderStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status },
      });
      
      res.status(200).json({ 
        data: updatedOrder, 
        message: "Status Updated Successfully" 
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getAllOrders(req: Request, res: Response) {
    try {
      const { clientId, gardenerId } = req.query;
      const whereClause: any = {};

      if (clientId) whereClause.clientId = clientId;
      if (gardenerId) whereClause.gardenerId = gardenerId;

      const data = await prisma.order.findMany({
        where: whereClause,
        include: {
          client: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
          gardener: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          client: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
          gardener: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });
      if (order) {
        res.status(200).json(order);
      } else {
        res.status(404).json({ error: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
