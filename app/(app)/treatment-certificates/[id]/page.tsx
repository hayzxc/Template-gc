import React from "react";
import { EditTreatmentCertificateClient } from "./EditTreatmentCertificateClient";

export default async function EditTreatmentCertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditTreatmentCertificateClient id={id} />;
}
