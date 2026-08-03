import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import fs from "fs";
import path from "path";
import { format } from "date-fns";
import type { TreatmentCertificateInput } from "@/lib/treatment-schema";
import type { CertificateInput } from "@/lib/certificate-schema";

const safeFmtDate = (d: Date | string | null | undefined, fmtStr: string = "dd/MM/yyyy"): string => {
  if (!d) return "";
  try {
    const dateObj = d instanceof Date ? d : new Date(String(d));
    if (isNaN(dateObj.getTime())) return "";
    return format(dateObj, fmtStr);
  } catch {
    return "";
  }
};

const safeFmtNum = (v: number | null | undefined, suffix: string = ""): string => {
  if (v === null || v === undefined || String(v).trim() === "") return "";
  return `${v}${suffix}`;
};

export function generateTreatmentDocx(data: TreatmentCertificateInput): Buffer {
  const templatePath = path.join(process.cwd(), "public", "templates", "treatment_template.docx");
  const content = fs.readFileSync(templatePath);
  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  const formattedData = {
    serialNo: data.serialNo || "",
    dateIssued: safeFmtDate(data.dateIssued),
    certificateNo: data.certificateNo || "",
    treatmentProviderId: data.treatmentProviderId || "ID0018MB",
    relatedDocumentNo: data.relatedDocumentNo || "",
    containers: data.containers || "",
    consigneeName: data.consigneeName || "",
    consigneeAddress: data.consigneeAddress || "",
    notifyParty: data.notifyParty || "",
    sealNumbers: data.sealNumbers || "",
    carrierVessel: data.carrierVessel || "",
    clientName: data.clientName || "",
    clientAddress: data.clientAddress || "",
    commodity: data.commodity || "",
    grossWeight: data.grossWeight || "",
    netWeight: data.netWeight || "",
    measurement: data.measurement || "",
    countryOfOrigin: data.countryOfOrigin || "",
    destinationCountry: data.destinationCountry || "",
    portOfLoading: data.portOfLoading || "",
    portOfUnloading: data.portOfUnloading || "",
    targetOfFumigation: data.targetOfFumigation || "",
    enclosureType: data.enclosureType || "",
    doseRate: safeFmtNum(data.doseRate, " g/m3"),
    exposurePeriod: safeFmtNum(data.exposurePeriod, " (hours)"),
    scheduleTemperature: safeFmtNum(data.scheduleTemperature, " °C"),
    appliedDose: safeFmtNum(data.appliedDose, " g/m3"),
    appliedExposurePeriod: safeFmtNum(data.appliedExposurePeriod, " (hours)"),
    appliedTemperature: safeFmtNum(data.appliedTemperature, " °C"),
    placeOfFumigation: data.placeOfFumigation || "",
    commencedAt: safeFmtDate(data.commencedAt, "dd/MM/yyyy – HH:mm"),
    completedAt: safeFmtDate(data.completedAt, "dd/MM/yyyy – HH:mm"),
    finalTlvPpm: safeFmtNum(data.finalTlvPpm, " ppm"),
    fullName: data.fullName || "",
    accreditationNumber: data.accreditationNumber || "",
    signatureDate: safeFmtDate(data.signatureDate),
    additionalDeclarations: data.additionalDeclarations || "",
  };

  doc.render(formattedData);

  const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });

  return buf;
}

export function generateCertificateDocx(data: CertificateInput): Buffer {
  const templatePath = path.join(process.cwd(), "public", "templates", "certificate_template.docx");
  const content = fs.readFileSync(templatePath);
  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  const formattedData = {
    registrationNumber: "ID0018MB",
    fumigant: "Methyl Bromide",
    certificateDate: safeFmtDate(data.certificateDate),
    commodity: data.commodity || "",
    containerNumber: data.containerNumber || "",
    carrierVessel: data.carrierVessel || "",
    fumigationArea: data.fumigationArea || "",
    commencingAt: safeFmtDate(data.commencingAt, "dd/MM/yyyy – HH:mm"),
    completedAt: safeFmtDate(data.completedAt, "dd/MM/yyyy – HH:mm"),
    gasLevelPpm: safeFmtNum(data.gasLevelPpm, " ppm"),
    fumigatorName: data.fumigatorName || "",
  };

  doc.render(formattedData);

  const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });

  return buf;
}
