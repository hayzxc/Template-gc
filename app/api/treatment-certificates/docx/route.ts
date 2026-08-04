import { NextResponse } from "next/server";
import { generateTreatmentDocx } from "@/lib/docx-generator";
import { treatmentCertificateSchema } from "@/lib/treatment-schema";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const validated = treatmentCertificateSchema.parse(json);
    const docxBuffer = generateTreatmentDocx(validated);

    const safeName = validated.certificateNo && validated.certificateNo.trim()
      ? validated.certificateNo.trim().replace(/[^a-zA-Z0-9_-]/g, "_")
      : "Treatment_Certificate";

    return new NextResponse(docxBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${safeName}.docx"`,
      },
    });
  } catch (error) {
    console.error("POST /api/treatment-certificates/docx error:", error);
    return NextResponse.json({ error: "Failed to generate DOCX" }, { status: 500 });
  }
}
