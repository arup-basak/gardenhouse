import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { errorHandler } from "./middlewares/error.handler";
import { UserSocketHandler, AdminSocketHandler } from "./socket_handler";

const PORT = process.env.PORT || 5000;

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const adminIo = io.of("/admin");
adminIo.on("connection", (socket) => {
  new AdminSocketHandler(io, socket);
});

const userIo = io.of("/user");
userIo.on("connection", (socket) => {
  new UserSocketHandler(io, socket);
});

app.use(errorHandler);

app.get("/healthcheck", (_: Request, res: Response) => {
  const now = new Date();
  res.json({
    success: true,
    timestamp: now.toISOString(),
    uptime: process.uptime(),
  });
});

app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

httpServer.listen(PORT, () => {
  console.log(`⚡️[PROCESSOR]: STARTED SOCKET SERVER http://localhost:${PORT}`);
});
