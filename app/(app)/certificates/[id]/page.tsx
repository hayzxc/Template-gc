import React from "react";
import { EditCertificateClient } from "./EditCertificateClient";

export default async function EditCertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditCertificateClient id={id} />;
}
