import { z } from "zod";

export const TransactionSchema = z.object({
  id: z.string(),
  userId: z.string().uuid(),
  orderId: z.string().uuid().nullable().optional(),
  startTime: z.date(),
  endTime: z.date(),
  totalAmount: z.number().min(0),
});

export const CreateTransactionSchema = TransactionSchema.omit({
  id: true,
});
