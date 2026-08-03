import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { certificateSchema } from "@/lib/certificate-schema";

export async function GET() {
  try {
    const certificates = await prisma.gasClearanceCertificate.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        commodity: true,
        containerNumber: true,
        certificateDate: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(certificates);
  } catch (error) {
    console.error("GET /api/certificates error:", error);
    return NextResponse.json(
      { error: "Database connection error or missing DATABASE_URL on Vercel" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = certificateSchema.safeParse(json);
    
    if (!result.success) {
      return NextResponse.json({ errors: result.error.flatten() }, { status: 400 });
    }

    const record = await prisma.gasClearanceCertificate.create({
      data: {
        ...result.data,
        fumigatorName: result.data.fumigatorName ?? "",
      },
    });
    
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
