import { Server, Socket } from "socket.io";

export function registerNotificationHandlers(io: Server, socket: Socket) {
  socket.on("notification:send", (data: {
    targetUserId: string;
    type: string;
    actorId: string;
    postId?: string;
  }) => {
    io.to(`notifications:${data.targetUserId}`).emit("notification:new", {
      type: data.type,
      actor: { id: data.actorId },
      postId: data.postId || null,
      read: false,
      createdAt: new Date().toISOString(),
    });
  });
}
