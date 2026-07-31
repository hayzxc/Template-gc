import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const asset = await prisma.companyAsset.findFirst();
    if (!asset) {
      return NextResponse.json({ stampImageUrl: "", logoImageUrl: "" });
    }
    return NextResponse.json(asset);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const json = await request.json();
    const { stampImageUrl, logoImageUrl } = json;

    if (!stampImageUrl || !logoImageUrl) {
      return NextResponse.json({ error: "Missing stampImageUrl or logoImageUrl" }, { status: 400 });
    }

    const existing = await prisma.companyAsset.findFirst();

    let asset;
    if (existing) {
      asset = await prisma.companyAsset.update({
        where: { id: existing.id },
        data: { stampImageUrl, logoImageUrl },
      });
    } else {
      asset = await prisma.companyAsset.create({
        data: { stampImageUrl, logoImageUrl },
      });
    }

    return NextResponse.json(asset);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
