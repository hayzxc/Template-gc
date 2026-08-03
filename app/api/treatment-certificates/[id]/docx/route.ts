import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTreatmentDocx } from "@/lib/docx-generator";
import { treatmentCertificateSchema } from "@/lib/treatment-schema";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cert = await prisma.treatmentCertificate.findUnique({
      where: { id },
    });

    if (!cert) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    const validated = treatmentCertificateSchema.parse({
      ...cert,
      doseRate: cert.doseRate ? Number(cert.doseRate) : null,
      exposurePeriod: cert.exposurePeriod ? Number(cert.exposurePeriod) : null,
      scheduleTemperature: cert.scheduleTemperature ? Number(cert.scheduleTemperature) : null,
      appliedDose: cert.appliedDose ? Number(cert.appliedDose) : null,
      appliedExposurePeriod: cert.appliedExposurePeriod ? Number(cert.appliedExposurePeriod) : null,
      appliedTemperature: cert.appliedTemperature ? Number(cert.appliedTemperature) : null,
      finalTlvPpm: cert.finalTlvPpm ? Number(cert.finalTlvPpm) : null,
    });

    const docxBuffer = generateTreatmentDocx(validated);

    const safeName = cert.certificateNo && cert.certificateNo.trim()
      ? cert.certificateNo.trim().replace(/[^a-zA-Z0-9_-]/g, "_")
      : "Treatment_Certificate";

    return new NextResponse(Uint8Array.from(docxBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${safeName}.docx"`,
      },
    });
  } catch (error) {
    console.error("GET /api/treatment-certificates/[id]/docx error:", error);
    return NextResponse.json({ error: "Failed to generate DOCX" }, { status: 500 });
  }
}
