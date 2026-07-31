import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import React from "react";
import { prisma } from "@/lib/prisma";
import { CertificateDocument } from "@/components/certificate/CertificateDocument";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const certificate = await prisma.gasClearanceCertificate.findUnique({
      where: { id },
    });

    if (!certificate) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const companyAsset = await prisma.companyAsset.findFirst();

    const doc = React.createElement(CertificateDocument, {
      data: {
        ...certificate,
        gasLevelPpm: Number(certificate.gasLevelPpm),
        fumigatorSignatureUrl: certificate.fumigatorSignatureUrl || undefined,
      },
      logoUrl: companyAsset?.logoImageUrl,
      stampUrl: companyAsset?.stampImageUrl,
    });

    const stream = await renderToStream(doc as any);

    const safeContainerNumber = certificate.containerNumber
      ? certificate.containerNumber.trim().replace(/[^a-zA-Z0-9_-]/g, "_")
      : "";
    const filename = safeContainerNumber ? `${safeContainerNumber}.pdf` : `GC-Certificate-${id}.pdf`;

    return new NextResponse(stream as unknown as ReadableStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
