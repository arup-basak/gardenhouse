import { Server, Socket } from "socket.io";
import { ChatService } from "../services/ChatService";
import { MessageSchema } from "../validations/chat.validation";

export class UserSocketHandler {
  constructor(private io: Server, private socket: Socket) {
    this.init();
  }

  private init(): void {
    const userId = this.socket.handshake.query.userId as string;

    this.socket.on("start_chat", () => this.handleStartChat(userId));
    this.socket.on("user_message", (data) => this.handleUserMessage(data));
    this.socket.on("end_chat", (data) => this.handleEndChat(data));
  }

  private async handleStartChat(userId: string): Promise<void> {
    try {
      const room = await ChatService.createChatRoom(userId);
      this.socket.join(room.id);
      this.io.of("/admin").emit("new_chat_request", room);
    } catch (error) {
      this.socket.emit("error", { message: "Failed to start chat" });
    }
  }
  private async handleUserMessage(messageData: any): Promise<void> {
    try {
      const message = MessageSchema.parse({
        ...messageData,
        type: "user-to-admin",
        timestamp: new Date(),
      });

      await ChatService.storeMessage(message);
      this.io.of("/admin").to(message.receiverId).emit("new_message", message);
    } catch (error) {
      this.socket.emit("error", { message: "Invalid message format" });
    }
  }

  private async handleEndChat(data: { chatId: string }): Promise<void> {
    try {
      await ChatService.endChatRoom(data.chatId);
      this.socket.leave(data.chatId);
      this.io.of("/admin").to(data.chatId).emit("chat_ended");
    } catch (error) {
      this.socket.emit("error", { message: "Failed to end chat" });
    }
  }
}
