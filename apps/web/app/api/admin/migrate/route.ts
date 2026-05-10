import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

export async function POST() {
  try {
    const output = execSync("npx prisma migrate deploy", {
      cwd: process.cwd(),
      encoding: "utf-8",
      timeout: 30000,
    });
    return NextResponse.json({ success: true, output });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message, stderr: e.stderr }, { status: 500 });
  }
}
