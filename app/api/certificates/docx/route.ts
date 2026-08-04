import { NextResponse } from "next/server";
import { generateCertificateDocx } from "@/lib/docx-generator";
import { certificateSchema } from "@/lib/certificate-schema";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const validated = certificateSchema.parse(json);
    const docxBuffer = generateCertificateDocx(validated);

    const safeName = validated.containerNumber && validated.containerNumber.trim()
      ? validated.containerNumber.trim().replace(/[^a-zA-Z0-9_-]/g, "_")
      : "Gas_Clearance_Certificate";

    return new NextResponse(docxBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${safeName}.docx"`,
      },
    });
  } catch (error) {
    console.error("POST /api/certificates/docx error:", error);
    return NextResponse.json({ error: "Failed to generate DOCX" }, { status: 500 });
  }
}
