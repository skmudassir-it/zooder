import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Create tables via raw SQL
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL, "username" TEXT NOT NULL, "displayName" TEXT NOT NULL,
        "email" TEXT NOT NULL, "emailVerified" TIMESTAMP(3), "passwordHash" TEXT,
        "avatarUrl" TEXT, "bio" TEXT, "website" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      )
    `);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username")`);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`);
    
    // Check tables
    const tables = await prisma.$queryRawUnsafe<Array<{table_name: string}>>(
      `SELECT table_name FROM information_schema.tables WHERE table_schema='public'`
    );
    return NextResponse.json({ success: true, tables: tables.map(t => t.table_name) });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
