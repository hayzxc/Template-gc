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

export const baseCertificateSchema = z.object({
  certificateDate: optionalDate,
  commodity: z.string().min(1).max(1000),
  containerNumber: z.string().min(1).max(1000),
  carrierVessel: z.string().min(1).max(1000),
  fumigationArea: z.string().min(1).max(1000),
  commencingAt: optionalDate,
  completedAt: optionalDate,
  gasLevelPpm: optionalNumber,
  fumigatorName: z.string().min(1).max(200),
  fumigatorSignatureUrl: z.string().url().optional().or(z.literal("")),
});

export const certificateSchema = baseCertificateSchema.refine(
  (d) => {
    if (d.commencingAt && d.completedAt) {
      return d.completedAt >= d.commencingAt;
    }
    return true;
  },
  {
    message: "Completed time must be after commencing time",
    path: ["completedAt"],
  }
);

export type CertificateInput = z.infer<typeof certificateSchema>;

