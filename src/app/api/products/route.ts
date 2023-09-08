import prisma from "@/lib/db/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(_request: NextRequest) {
  const products = await prisma.product.findMany({
    orderBy: { id: "desc" }
  })

  return NextResponse.json(products)
}
