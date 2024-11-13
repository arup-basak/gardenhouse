interface ChatRoom {
  id: string;
  userId: string;
  assignedAdmin?: string;
  status: "active" | "closed";
  createdAt: Date;
}

type Message = IMessage;