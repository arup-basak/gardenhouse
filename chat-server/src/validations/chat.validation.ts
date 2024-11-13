import { z } from 'zod';

export const MessageSchema = z.object({
  content: z.string().min(1).max(1000),
  senderId: z.string(),
  receiverId: z.string(),
  timestamp: z.date(),
  type: z.enum(['user-to-admin', 'admin-to-user']),
  status: z.enum(['pending', 'assigned', 'completed']),
});

export const ChatAssignmentSchema = z.object({
  chatId: z.string(),
  adminId: z.string(),
  timestamp: z.date(),
});

export type Message = z.infer<typeof MessageSchema>;
export type ChatAssignment = z.infer<typeof ChatAssignmentSchema>;
