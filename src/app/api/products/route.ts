import prisma from "@/lib/db/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { id: "desc" }
  })

  return NextResponse.json(products)
}
