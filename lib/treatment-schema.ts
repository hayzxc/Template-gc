import { z } from "zod";

const optionalDate = z
  .union([z.date(), z.string(), z.null(), z.undefined()])
  .transform((val): Date | null => {
    if (!val || val === "") return null;
    const d = val instanceof Date ? val : new Date(String(val));
    return isNaN(d.getTime()) ? null : d;
  });

const optionalNumber = z
  .union([z.number(), z.string(), z.null(), z.undefined()])
  .transform((val): number | null => {
    if (val === "" || val === null || val === undefined) return null;
    const n = Number(val);
    return isNaN(n) ? null : n;
  });

export const treatmentCertificateSchema = z.object({
  hideLetterhead: z.boolean().optional().default(false),
  serialNo: z.string().optional().default(""),
  dateIssued: optionalDate,
  certificateNo: z.string().optional().default(""),
  treatmentProviderId: z.string().optional().default("ID0018MB"),
  relatedDocumentNo: z.string().optional().default(""),
  containers: z.string().optional().default(""),
  consigneeName: z.string().optional().default(""),
  consigneeAddress: z.string().optional().default(""),
  notifyParty: z.string().optional().default(""),
  sealNumbers: z.string().optional().default(""),
  carrierVessel: z.string().optional().default(""),
  clientName: z.string().optional().default(""),
  clientAddress: z.string().optional().default(""),
  commodity: z.string().optional().default(""),
  grossWeight: z.string().optional().default(""),
  netWeight: z.string().optional().default(""),
  measurement: z.string().optional().default(""),
  countryOfOrigin: z.string().optional().default(""),
  destinationCountry: z.string().optional().default(""),
  portOfLoading: z.string().optional().default(""),
  portOfUnloading: z.string().optional().default(""),
  targetOfFumigation: z.string().optional().default(""),
  enclosureType: z.string().optional().default(""),
  doseRate: optionalNumber,
  exposurePeriod: optionalNumber,
  scheduleTemperature: optionalNumber,
  appliedDose: optionalNumber,
  appliedExposurePeriod: optionalNumber,
  appliedTemperature: optionalNumber,
  placeOfFumigation: z.string().optional().default(""),
  commencedAt: optionalDate,
  completedAt: optionalDate,
  finalTlvPpm: optionalNumber,
  fullName: z.string().optional().default(""),
  accreditationNumber: z.string().optional().default(""),
  signatureDate: optionalDate,
  signatureUrl: z.string().optional().default(""),
  additionalDeclarations: z.string().optional().default(""),
});

export type TreatmentCertificateInput = z.infer<typeof treatmentCertificateSchema>;
