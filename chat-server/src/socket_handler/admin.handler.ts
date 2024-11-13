import { Server, Socket } from "socket.io";
import { ChatService } from "../services/ChatService";
import { MessageSchema } from "../validations/chat.validation";

export class AdminSocketHandler {
  constructor(private io: Server, private socket: Socket) {
    this.init();
  }

  private init(): void {
    const adminId = this.socket.handshake.query.adminId as string;

    this.socket.on("get_unassigned_chats", () =>
      this.handleGetUnassignedChats()
    );
    this.socket.on("assign_chat", (data) =>
      this.handleAssignChat(data, adminId)
    );
    this.socket.on("admin_message", (data) => this.handleAdminMessage(data));
    this.socket.on("end_chat", (data) => this.handleEndChat(data));
  }

  private async handleGetUnassignedChats(): Promise<void> {
    try {
      const chats = await ChatService.getUnassignedChats();
      this.socket.emit("unassigned_chats", chats);
    } catch (error) {
      this.socket.emit("error", { message: "Failed to get unassigned chats" });
    }
  }

  private async handleAssignChat(
    data: { chatId: string },
    adminId: string
  ): Promise<void> {
    try {
      await ChatService.assignAdminToChat(data.chatId, adminId);
      this.socket.join(data.chatId);
      this.io.emit("chat_assigned", { chatId: data.chatId, adminId });
    } catch (error) {
      this.socket.emit("error", { message: "Failed to assign chat" });
    }
  }

  private async handleAdminMessage(messageData: any): Promise<void> {
    try {
      const message = MessageSchema.parse({
        ...messageData,
        type: "admin-to-user",
        timestamp: new Date(),
      });

      await ChatService.storeMessage(message);
      this.io.to(message.receiverId).emit("new_message", message);
    } catch (error) {
      this.socket.emit("error", { message: "Invalid message format" });
    }
  }

  private async handleEndChat(data: { chatId: string }): Promise<void> {
    try {
      await ChatService.endChatRoom(data.chatId);
      this.socket.leave(data.chatId);
      this.io.to(data.chatId).emit("chat_ended");
    } catch (error) {
      this.socket.emit("error", { message: "Failed to end chat" });
    }
  }
}
