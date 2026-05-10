import jwt from "jsonwebtoken";

const AUTH_SECRET = process.env.AUTH_SECRET || "change-me";

export function verifyToken(token: string): { sub: string } {
  return jwt.verify(token, AUTH_SECRET) as { sub: string };
}

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, AUTH_SECRET, { expiresIn: "30d" });
}
