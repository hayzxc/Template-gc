import { z } from "zod";

export const baseCertificateSchema = z.object({
  certificateDate: z.coerce.date(),
  commodity: z.string().min(1).max(1000),
  containerNumber: z.string().min(1).max(1000),
  carrierVessel: z.string().min(1).max(1000),
  fumigationArea: z.string().min(1).max(1000),
  commencingAt: z.coerce.date(),
  completedAt: z.coerce.date(),
  gasLevelPpm: z.coerce.number().min(0),
  fumigatorName: z.string().min(1).max(200),
  fumigatorSignatureUrl: z.string().url().optional().or(z.literal("")),
});

export const certificateSchema = baseCertificateSchema.refine(d => d.completedAt >= d.commencingAt, {
  message: "Completed time must be after commencing time",
  path: ["completedAt"],
});

export type CertificateInput = z.infer<typeof certificateSchema>;
