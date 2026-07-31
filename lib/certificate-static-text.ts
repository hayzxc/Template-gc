// Verbatim text extracted from Template GC.docx (word/document.xml + footer1.xml).
// Do not reword: the rendered certificate must match the template exactly.
export const CERTIFICATE_STATIC_TEXT = {
  titleId: "SERTIFIKAT BEBAS GAS",
  titleEn: "GAS CLEARANCE CERTIFICATE",
  regLabelId: "Nomor Registrasi",
  regLabelEn: "Registration Number",
  dateLabelId: "Tanggal",
  dateLabelEn: "Date (dd/mm/yyyy)",
  headingId: "Kepada pihak-pihak yang berkepentingan",
  headingEn: "To whom it may concern",
  introId: "Saya sebagai penanggungjawab fumigasi di bawah ini:",
  introEn: "I, being the person-in-charge of the fumigation of the following:",
  decl1Id:
    "Bersama ini menyatakan bahwa tempat, peti kemas dan komoditas/media pembawa tersebut di atas telah bebas dari konsentrasi gas yang membahayakan.",
  decl1En:
    "Hereby declare that the area, container and the commodity/article mentioned above is free from harmful concentration of the gas.",
  decl2Id:
    "Saya membuat pernyataan ini setelah memeriksa konsentrasi gas di area serta ruangan fumigasi.",
  decl2En:
    "I make this declaration after having examined the gas levels in the area and the fumigation workspace.",
  gasLabelId: "Konsentrasi gas setelah penganginan",
  gasLabelEn: "Gas levels after fumigation",
  signerLabelId: "Pelaksana Fumigasi,",
  signerLabelEn: "Fumigation company",
  stampLabelId: "Cap Perusahaan Fumigasi*",
  stampLabelEn: "Stamp of company*",
  signatureLabelEn: "Signature and name of fumigator",
  footerPrefix: "Printed digitally through: ",
  footerBrand: "FUMI TRUST by BARANTIN.",
  footerVerify:
    "The authenticity of this document can be verified through the QRcode above or via the following link: ",
  footerLink: "GC-1785134220-99ab6a2f-ID0018MB-20260727",
} as const;

// Bilingual field label pairs, in template order (values come from the form).
export const CERTIFICATE_FIELD_LABELS = {
  commodity: { id: "Nama komoditas/media pembawa", en: "Commodity/article" },
  containerNumber: { id: "Nomor peti kemas", en: "Container number" },
  carrierVessel: { id: "Alat angkut", en: "Carrier/vessel" },
  fumigationArea: { id: "Area / Lokasi fumigasi", en: "Area/Location of Fumigation" },
  fumigant: { id: "Fumigan yang digunakan", en: "Fumigant" },
  commencingAt: { id: "Waktu dimulainya fumigasi", en: "Commencing at (dd/mm/yyyy \u2013 HH:MM)" },
  completedAt: { id: "Waktu selesainya fumigasi", en: "Completed at (dd/mm/yyyy \u2013 HH:MM)" },
} as const;
