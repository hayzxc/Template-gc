import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { treatmentCertificateSchema } from "@/lib/treatment-schema";

export async function GET() {
  try {
    const certificates = await prisma.treatmentCertificate.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        certificateNo: true,
        commodity: true,
        dateIssued: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(certificates);
  } catch (error) {
    console.error("GET /api/treatment-certificates error:", error);
    return NextResponse.json(
      { error: "Database connection error or missing DATABASE_URL" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = treatmentCertificateSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json({ errors: result.error.flatten() }, { status: 400 });
    }

    const data = result.data;
    const record = await prisma.treatmentCertificate.create({
      data: {
        serialNo: data.serialNo ?? "",
        dateIssued: data.dateIssued,
        certificateNo: data.certificateNo ?? "",
        treatmentProviderId: result.data.treatmentProviderId || "ID0018MB",
        relatedDocumentNo: data.relatedDocumentNo ?? "",
        containers: data.containers ?? "",
        consigneeName: data.consigneeName ?? "",
        consigneeAddress: data.consigneeAddress ?? "",
        notifyParty: data.notifyParty ?? "",
        sealNumbers: data.sealNumbers ?? "",
        carrierVessel: data.carrierVessel ?? "",
        clientName: data.clientName ?? "",
        clientAddress: data.clientAddress ?? "",
        commodity: data.commodity ?? "",
        countryOfOrigin: data.countryOfOrigin ?? "",
        destinationCountry: data.destinationCountry ?? "",
        portOfLoading: data.portOfLoading ?? "",
        portOfUnloading: data.portOfUnloading ?? "",
        targetOfFumigation: data.targetOfFumigation ?? "",
        enclosureType: data.enclosureType ?? "",
        doseRate: data.doseRate,
        exposurePeriod: data.exposurePeriod,
        scheduleTemperature: data.scheduleTemperature,
        appliedDose: data.appliedDose,
        appliedExposurePeriod: data.appliedExposurePeriod,
        appliedTemperature: data.appliedTemperature,
        placeOfFumigation: data.placeOfFumigation ?? "",
        commencedAt: data.commencedAt,
        completedAt: data.completedAt,
        finalTlvPpm: data.finalTlvPpm,
        fullName: data.fullName ?? "",
        accreditationNumber: data.accreditationNumber ?? "",
        signatureDate: data.signatureDate,
        signatureUrl: data.signatureUrl ?? "",
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("POST /api/treatment-certificates error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
