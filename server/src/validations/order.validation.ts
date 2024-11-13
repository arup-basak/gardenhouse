import { z } from "zod";

export const OrderStatusEnum = z.enum([
  "PENDING",
  "ACCEPTED",
  "COMPLETED",
  "CANCELLED",
]);

export const OrderSchema = z.object({
  id: z.string().uuid(),
  status: OrderStatusEnum.default("PENDING"),
  clientId: z.string().uuid(),
  gardenerId: z.string().uuid(),
  transactionId: z.string(),
});

export const CreateOrderSchema = OrderSchema.omit({
  id: true,
});
