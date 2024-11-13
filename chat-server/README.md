# Chat Server

This is a real-time chat server built with Socket.IO, Express, and TypeScript. It facilitates communication between users and administrators.  Users can initiate chat requests, send messages, and end chats. Administrators can view unassigned chats, assign themselves to chats, send messages to users, and end chats.  The server uses namespaces to separate user and admin connections.

## File Structure

- `src/index.ts`: Main entry point for the server.  Sets up the Express app, HTTP server, and Socket.IO connections.  Handles namespaces for users and admins.
- `src/socket_handler/admin.handler.ts`: Handles Socket.IO events for admin connections.
- `src/socket_handler/user.handler.ts`: Handles Socket.IO events for user connections.
- `src/services/ChatService.ts`: Contains the logic for chat-related operations (e.g., creating chat rooms, assigning admins, storing messages).
- `src/validations/chat.validation.ts`: Defines validation schemas for chat messages using Zod.
- `src/middlewares/error.handler.ts`: Contains middleware for handling errors.


## API Reference

### Admin Namespace (`/admin`)

| Event Name | Description | Data Sent | Data Received |
|---|---|---|---|
| `connection` | Triggered when an admin connects. Requires `adminId` as a query parameter. |  |  |
| `get_unassigned_chats` | Requests a list of unassigned chats. |  | `unassigned_chats`: An array of chat room objects. |
| `assign_chat` | Assigns an admin to a chat. | `{ chatId: string }` | `chat_assigned`: `{ chatId: string, adminId: string }` |
| `admin_message` | Sends a message from the admin to the user. | `{ chatId: string, senderId: string, receiverId: string, content: string }` | `new_message`: The message object. |
| `end_chat` | Ends a chat. | `{ chatId: string }` | `chat_ended`:  |
| `new_chat_request` | Notifies admins of a new chat request from a user. | Chat room object | |
| `error` | Emitted when an error occurs. | `{ message: string }` | |


### User Namespace (`/user`)

| Event Name | Description | Data Sent | Data Received |
|---|---|---|---|
| `connection` | Triggered when a user connects. Requires `userId` as a query parameter. |  |  |
| `start_chat` | Initiates a new chat request. |  |  |
| `user_message` | Sends a message from the user to the admin. | `{ chatId: string, senderId: string, receiverId: string, content: string }` | `new_message`: The message object. |
| `end_chat` | Ends a chat. | `{ chatId: string }` | `chat_ended`:  |
| `error` | Emitted when an error occurs. | `{ message: string }` | |


## Error Handling

The server includes error handling middleware to catch and handle errors gracefully.  Error messages are sent to the client using the `error` event.


## Running the Server

1. Install dependencies: `npm install`
2. Set environment variables (if needed):  `PORT`, `FRONTEND_URL`
3. Start the server: `npm start`
