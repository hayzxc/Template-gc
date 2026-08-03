import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateCertificateDocx } from "@/lib/docx-generator";
import { certificateSchema } from "@/lib/certificate-schema";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cert = await prisma.gasClearanceCertificate.findUnique({
      where: { id },
    });

    if (!cert) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    const validated = certificateSchema.parse({
      ...cert,
      gasLevelPpm: cert.gasLevelPpm ? Number(cert.gasLevelPpm) : null,
    });

    const docxBuffer = generateCertificateDocx(validated);

    const safeName = cert.containerNumber && cert.containerNumber.trim()
      ? cert.containerNumber.trim().replace(/[^a-zA-Z0-9_-]/g, "_")
      : "Gas_Clearance_Certificate";

    return new NextResponse(Uint8Array.from(docxBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${safeName}.docx"`,
      },
    });
  } catch (error) {
    console.error("GET /api/certificates/[id]/docx error:", error);
    return NextResponse.json({ error: "Failed to generate DOCX" }, { status: 500 });
  }
}
