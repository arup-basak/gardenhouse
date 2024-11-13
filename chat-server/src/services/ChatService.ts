import { v4 as uuidv4 } from "uuid";
import redis from "../libs/redis";
import { ChatAssignment, Message } from "../validations/chat.validation";
import prisma from "../libs/prisma";
import { PrismaClient } from "@prisma/client";

export class ChatService {
  private static readonly CHAT_ROOMS_KEY = "chat_rooms";
  private static readonly MESSAGES_KEY = "messages";
  private static readonly ADMIN_ASSIGNMENTS_KEY = "admin_assignments";

  static async createChatRoom(userId: string): Promise<ChatRoom> {
    const room: ChatRoom = {
      id: uuidv4(),
      userId,
      status: "active",
      createdAt: new Date(),
    };

    await redis.hset(this.CHAT_ROOMS_KEY, room.id, JSON.stringify(room));

    return room;
  }

  static async assignAdminToChat(
    chatId: string,
    adminId: string
  ): Promise<void> {
    const roomData = await redis.hget(this.CHAT_ROOMS_KEY, chatId);
    if (!roomData) throw new Error("Chat room not found");

    const room: ChatRoom = JSON.parse(roomData);
    room.assignedAdmin = adminId;

    await redis.hset(this.CHAT_ROOMS_KEY, chatId, JSON.stringify(room));

    const assignment: ChatAssignment = {
      chatId,
      adminId,
      timestamp: new Date(),
    };

    await redis.hset(
      this.ADMIN_ASSIGNMENTS_KEY,
      chatId,
      JSON.stringify(assignment)
    );
  }

  static async storeMessage(message: Message): Promise<void> {
    const messageId = uuidv4();
    await redis.hset(
      `${this.MESSAGES_KEY}:${message.senderId}_${message.receiverId}`,
      messageId,
      JSON.stringify(message)
    );
  }

  static async getMessages(
    senderId: string,
    receiverId: string
  ): Promise<Message[]> {
    const messages = await redis.hgetall(
      `${this.MESSAGES_KEY}:${senderId}_${receiverId}`
    );
    return Object.values(messages).map((msg) => JSON.parse(msg));
  }

  static async getUnassignedChats(): Promise<ChatRoom[]> {
    const rooms = await redis.hgetall(this.CHAT_ROOMS_KEY);
    return Object.values(rooms)
      .map((room) => JSON.parse(room))
      .filter((room) => !room.assignedAdmin && room.status === "active");
  }

  static async getAdminChats(adminId: string): Promise<ChatRoom[]> {
    const rooms = await redis.hgetall(this.CHAT_ROOMS_KEY);
    return Object.values(rooms)
      .map((room) => JSON.parse(room))
      .filter((room) => room.assignedAdmin === adminId);
  }

  static async endChatRoom(chatId: string): Promise<void> {
    const roomData = await redis.hget(this.CHAT_ROOMS_KEY, chatId);
    if (!roomData) throw new Error("Chat room not found");
  
    const room: ChatRoom = JSON.parse(roomData);
    const messages = await this.getMessages(room.userId, room.assignedAdmin!);
  
    await prisma.$transaction(async (tx: any) => {
      await tx.chatRoom.create({
        data: {
          id: room.id,
          userId: room.userId,
          adminId: room.assignedAdmin,
          status: "closed",
          createdAt: room.createdAt,
          closedAt: new Date(),
          messages: {
            create: messages.map((msg) => ({
              senderId: msg.senderId,
              receiverId: msg.receiverId,
              content: msg.content,
              type: msg.type,
              timestamp: msg.timestamp,
            })),
          },
        },
      });
    });
  
    await Promise.all([
      redis.hdel(this.CHAT_ROOMS_KEY, chatId),
      redis.hdel(this.ADMIN_ASSIGNMENTS_KEY, chatId),
      redis.del(`${this.MESSAGES_KEY}:${room.userId}_${room.assignedAdmin}`),
      redis.del(`${this.MESSAGES_KEY}:${room.assignedAdmin}_${room.userId}`),
    ]);
  }
}
