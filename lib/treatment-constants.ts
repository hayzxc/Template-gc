// Static text and labels extracted 1:1 from certificate_reference.docx (word/document.xml).
export const TREATMENT_CONSTANTS = {
  // Company header
  companyName: "PRANA ARGENTUM CORPORATION",
  companySubtitle1: "Cargo & Marine Surveyor, Technical Inspection, Fumigation, Testing Laboratory, Termite and Pest Control",
  companySubtitle2: "Members Of The Association of Independent Surveyor Indonesia (AISI)",
  companySubtitle3: "Members Of Indonesian Pest Control Association (IPCA)",
  companySubtitle4: "Members Of Australian Fumigation Accreditation Scheme (AFAS)",

  // Certificate title
  title: "TREATMENT CERTIFICATE - Methyl Bromide Fumigation",

  // Section headers
  consignmentDetailsHeader: "Consignment details",
  treatmentScheduleHeader: "Treatment schedule (prescribed/specified treatment schedule)",
  fumigationDetailsHeader: "Fumigation details (treatment applied)",
  declarationHeader: "Declaration",
  additionalDeclarationsHeader: "Additional Declarations",

  // Declaration text (Numbered list matching reference screenshot)
  declarationLine1: "I, the fumigator-in-charge declare:",
  declarationLine2: "1. The fumigation certified was conducted in accordance with the treatment schedule, import conditions, and all the requirements in the Methyl Bromide Fumigation Methodology, and",
  declarationLine3: "2. The information I have provided is true and correct.",

  // Field labels
  serialNoLabel: "Serial No.",
  dateIssuedLabel: "Date issued (dd/mm/yyyy)",
  certificateNumberLabel: "Certificate number",
  treatmentProviderIdLabel: "Treatment provider ID number",
  relatedDocumentNoLabel: "Related Document Number :",
  containersLabel: "Containers :",
  consigneeLabel: "CONSIGNEE :",
  notifyPartyLabel: "NOTIFY PARTY :",
  consignmentLinkLabel: "Consignment link (container numbers if applicable)",
  sealNumbersLabel: "Seal numbers(s) and Carrier/vessel (if applicable)",
  clientNameLabel: "Client name and address",
  commodityLabel: "Commodity description and quantity",
  countryOfOriginLabel: "Commodity country of origin",
  destinationCountryLabel: "Destination country",
  portOfLoadingLabel: "Port of loading",
  portOfUnloadingLabel: "Port of unloading",
  targetOfFumigationLabel: "Target of fumigation",
  enclosureTypeLabel: "Enclosure type",

  // Treatment schedule labels
  doseRateLabel: "Dose rate",
  exposurePeriodLabel: "Exposure period",
  temperatureLabel: "Temperature",
  doseRateUnit: "g/m3",
  exposurePeriodUnit: "(hours)",
  temperatureUnit: "°C",

  // Fumigation details labels
  appliedDoseLabel: "Applied dose",
  placeOfFumigationLabel: "Place of fumigation (Full address)",
  commencedAtLabel: "Date and time fumigation commenced (dd/mm/yyyy – HH:MM)",
  completedAtLabel: "Date and time fumigation completed (dd/mm/yyyy – HH:MM)",
  finalTlvLabel: "Final TLV reading (ppm)",

  // Signature section
  signatureLabel: "Signature",
  fullNameLabel: "Full name",
  accreditationNumberLabel: "Accreditation number",
  dateLabel: "Date (dd/mm/yyyy)",

  // Footer text
  footerPrefix: "Printed digitally through: ",
  footerBrand: "FUMI TRUST by BARANTIN.",
  footerVerify: "The authenticity of this document can be verified through the QRcode above or via the following link ",
} as const;
