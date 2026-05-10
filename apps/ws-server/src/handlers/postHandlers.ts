import { Server, Socket } from "socket.io";

export function registerPostHandlers(io: Server, socket: Socket) {
  const userId = socket.data.userId;

  socket.on("post:create", (data: { content: string; mediaUrls?: string[] }) => {
    // This gets emitted from the API after post is saved to DB
    // The API sends the full post object via Redis pub/sub
    io.to(`feed:${userId}`).emit("feed:new_post", {
      ...data,
      authorId: userId,
    });
  });

  socket.on("post:like", (postId: string) => {
    io.to(`notifications:${userId}`).emit("post:liked", {
      postId,
      userId,
    });
  });
}
