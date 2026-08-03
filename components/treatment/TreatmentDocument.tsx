import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import { format } from "date-fns";
import { TC_PAGE, TC_COLORS } from "@/lib/treatment-tokens";
import { TREATMENT_CONSTANTS as TC } from "@/lib/treatment-constants";
import { TREATMENT_HEADER_IMAGE_DATA_URI } from "@/lib/treatment-assets";
import type { TreatmentCertificateInput } from "@/lib/treatment-schema";

// Register Calibri fonts for react-pdf
if (typeof window !== "undefined") {
  const origin = window.location.origin;
  Font.register({
    family: "Calibri",
    fonts: [
      { src: `${origin}/fonts/calibri.ttf`, fontWeight: "normal" },
      { src: `${origin}/fonts/calibrib.ttf`, fontWeight: "bold" },
    ],
  });
} else {
  try {
    const path = require("path");
    Font.register({
      family: "Calibri",
      fonts: [
        { src: path.join(process.cwd(), "public/fonts/calibri.ttf"), fontWeight: "normal" },
        { src: path.join(process.cwd(), "public/fonts/calibrib.ttf"), fontWeight: "bold" },
      ],
    });
  } catch {
    // Fallback if path resolve is unavailable
  }
}

const s = StyleSheet.create({
  page: {
    paddingTop: 15,
    paddingBottom: 12,
    paddingLeft: TC_PAGE.paddingLeft,
    paddingRight: TC_PAGE.paddingRight,
    fontFamily: "Calibri",
    fontSize: 6,
  },
  // Letterhead Image (Proportional ~6.32 : 1 aspect ratio)
  letterheadImage: {
    width: "100%",
    height: 64,
    objectFit: "contain" as const,
    marginLeft: 4,
    marginBottom: 4,
  },
  // Top right header container (Stacked vertically)
  headerContainer: {
    alignItems: "flex-end",
    marginBottom: 2,
  },
  headerLine: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 0.5,
  },
  headerLabel: {
    fontSize: 6,
    fontFamily: "Calibri",
  },
  headerSubLabel: {
    fontSize: 5,
    color: "#555555",
    fontFamily: "Calibri",
  },
  headerValueBold: {
    fontFamily: "Calibri",
    fontWeight: "bold",
    fontSize: 6,
    marginLeft: 3,
  },
  headerValue: {
    fontSize: 6,
    fontFamily: "Calibri",
    marginLeft: 3,
  },
  // Title
  titleText: {
    fontFamily: "Calibri",
    fontWeight: "bold",
    fontSize: 8.5,
    color: TC_COLORS.sectionBlue,
    textDecoration: "underline",
    marginBottom: 2,
  },
  // Section heading
  sectionHeader: {
    fontFamily: "Calibri",
    fontWeight: "bold",
    fontSize: 7.5,
    color: TC_COLORS.sectionBlue,
    marginTop: 2,
    marginBottom: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: TC_COLORS.sectionBlue,
    paddingBottom: 0.5,
  },
  // Table 1 (Black header)
  table1HeaderCell: {
    backgroundColor: TC_COLORS.table1HeaderBg,
    paddingVertical: 1.5,
    paddingHorizontal: 3,
    borderRightWidth: 0.5,
    borderRightColor: TC_COLORS.border,
  },
  table1HeaderText: {
    fontFamily: "Calibri",
    fontWeight: "bold",
    fontSize: 6,
    color: TC_COLORS.table1HeaderText,
  },
  // General table
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: TC_COLORS.border,
    borderLeftWidth: 0.5,
    borderLeftColor: TC_COLORS.border,
    borderRightWidth: 0.5,
    borderRightColor: TC_COLORS.border,
  },
  cellBold: {
    fontFamily: "Calibri",
    fontWeight: "bold",
    fontSize: 6,
  },
  cellNormal: {
    fontFamily: "Calibri",
    fontWeight: "normal",
    fontSize: 6,
  },
  // Table 3 & 4 Gray Background
  tableGrayRow: {
    flexDirection: "row",
    backgroundColor: TC_COLORS.tableGrayBg,
    borderWidth: 0.5,
    borderColor: TC_COLORS.border,
  },
  // Declaration text
  declarationText: {
    fontFamily: "Calibri",
    fontSize: 6,
    marginBottom: 0.5,
    lineHeight: 1.1,
  },
  declarationIndent: {
    fontFamily: "Calibri",
    fontSize: 6,
    marginBottom: 0.5,
    lineHeight: 1.1,
    paddingLeft: 8,
  },
  // Signature image
  signatureImage: {
    width: 60,
    height: 20,
    objectFit: "contain" as const,
  },
  // Additional declarations box
  addDeclBox: {
    borderWidth: 0.5,
    borderColor: TC_COLORS.border,
    minHeight: 16,
    padding: 2,
    marginTop: 1.5,
  },
  // Footer
  footerRule: {
    position: "absolute",
    left: TC_PAGE.paddingLeft,
    bottom: 16,
    width: TC_PAGE.contentWidth,
    height: 0.5,
    backgroundColor: "#000000",
  },
  footerText: {
    position: "absolute",
    left: TC_PAGE.paddingLeft,
    bottom: 6,
    fontSize: 5,
    lineHeight: 1.1,
    fontFamily: "Calibri",
  },
});

interface TreatmentDocumentProps {
  data: TreatmentCertificateInput;
}

const safeFmt = (d: Date | string | null | undefined, fmtStr: string) => {
  try {
    if (!d) return "";
    const dateObj = d instanceof Date ? d : new Date(String(d));
    if (isNaN(dateObj.getTime())) return "";
    return format(dateObj, fmtStr);
  } catch {
    return "";
  }
};

const fmtNum = (v: number | null | undefined): string => {
  if (v === null || v === undefined) return "";
  return String(v);
};

const fmtUnit = (v: number | null | undefined, unit: string): string => {
  if (v === null || v === undefined || String(v).trim() === "") return "";
  return `${v} ${unit}`;
};

export const TreatmentDocument: React.FC<TreatmentDocumentProps> = ({ data }) => {
  const dateIssued = safeFmt(data.dateIssued, "dd/MM/yyyy");
  const commencedStr = safeFmt(data.commencedAt, "dd/MM/yyyy – HH:mm");
  const completedStr = safeFmt(data.completedAt, "dd/MM/yyyy – HH:mm");
  const sigDate = safeFmt(data.signatureDate, "dd/MM/yyyy");

  return (
    <Document>
      <Page size={TC_PAGE.size} style={s.page} wrap={false}>
        {/* Company Letterhead Image (Omitted if hideLetterhead is true) */}
        {!data.hideLetterhead && (
          <Image
            src={TREATMENT_HEADER_IMAGE_DATA_URI}
            style={s.letterheadImage}
          />
        )}

        {/* Stacked Serial No. & Date issued */}
        <View style={s.headerContainer}>
          <View style={s.headerLine}>
            <Text style={s.headerLabel}>Serial No. </Text>
            <Text style={s.headerValueBold}>{data.serialNo || ""}</Text>
          </View>
          <View style={s.headerLine}>
            <Text style={s.headerLabel}>Date issued </Text>
            <Text style={s.headerSubLabel}>(dd/mm/yyyy) </Text>
            <Text style={s.headerValue}>{dateIssued}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={s.titleText}>{TC.title}</Text>

        {/* Table 1: Certificate number & Provider ID (ONLY Treatment Provider ID IS BOLD) */}
        <View style={s.tableRow}>
          <View style={[s.table1HeaderCell, { width: "50%" }]}>
            <Text style={s.table1HeaderText}>{TC.certificateNumberLabel}</Text>
          </View>
          <View style={[s.table1HeaderCell, { width: "50%", borderRightWidth: 0 }]}>
            <Text style={s.table1HeaderText}>{TC.treatmentProviderIdLabel}</Text>
          </View>
        </View>
        <View style={s.tableRow}>
          <Text style={[{ width: "50%", padding: 2, borderRightWidth: 0.5, borderRightColor: TC_COLORS.border }, s.cellNormal]}>
            {data.certificateNo || " "}
          </Text>
          <Text style={[{ width: "50%", padding: 2 }, s.cellBold]}>
            {data.treatmentProviderId || "ID0018MB"}
          </Text>
        </View>

        {/* Section: Consignment details */}
        <Text style={s.sectionHeader}>{TC.consignmentDetailsHeader}</Text>

        <View style={s.tableRow}>
          <Text style={[{ width: "32%", padding: 2, borderRightWidth: 0.5, borderRightColor: TC_COLORS.border }]}>
            {TC.consignmentLinkLabel}
          </Text>
          <View style={[{ width: "68%", padding: 2 }]}>
            <Text>{TC.relatedDocumentNoLabel} <Text style={s.cellNormal}>{data.relatedDocumentNo}</Text></Text>
            <Text>{TC.containersLabel} <Text style={s.cellNormal}>{data.containers}</Text></Text>
            <Text>{TC.consigneeLabel}</Text>
            <Text style={s.cellNormal}>{[data.consigneeName, data.consigneeAddress].filter(Boolean).join("\n")}</Text>
            {data.notifyParty ? (
              <View style={{ marginTop: 1 }}>
                <Text>{TC.notifyPartyLabel}</Text>
                <Text style={s.cellNormal}>{data.notifyParty}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={s.tableRow}>
          <Text style={[{ width: "32%", padding: 2, borderRightWidth: 0.5, borderRightColor: TC_COLORS.border }]}>
            {TC.sealNumbersLabel}
          </Text>
          <View style={[{ width: "68%", padding: 2 }]}>
            <Text>Seal numbers : <Text style={s.cellNormal}>{data.sealNumbers}</Text></Text>
            <Text>Carrier/vessel : <Text style={s.cellNormal}>{data.carrierVessel}</Text></Text>
          </View>
        </View>

        <View style={s.tableRow}>
          <Text style={[{ width: "32%", padding: 2, borderRightWidth: 0.5, borderRightColor: TC_COLORS.border }]}>
            {TC.clientNameLabel}
          </Text>
          <Text style={[{ width: "68%", padding: 2 }, s.cellNormal]}>
            {[data.clientName, data.clientAddress].filter(Boolean).join("\n") || " "}
          </Text>
        </View>

        <View style={s.tableRow}>
          <Text style={[{ width: "32%", padding: 2, borderRightWidth: 0.5, borderRightColor: TC_COLORS.border }]}>
            {TC.commodityLabel}
          </Text>
          <View style={[{ width: "68%", padding: 2 }]}>
            <Text style={s.cellNormal}>{data.commodity || " "}</Text>
            {(data.grossWeight || data.netWeight || data.measurement) ? (
              <View style={{ marginTop: 4 }}>
                {data.grossWeight ? (
                  <Text style={s.cellNormal}>
                    {data.grossWeight.includes("GW") || data.grossWeight.includes(":") || data.grossWeight.includes("\n")
                      ? data.grossWeight
                      : `GW : ${data.grossWeight} KGS`}
                  </Text>
                ) : null}
                {data.netWeight && !data.grossWeight?.includes("NW") ? <Text style={s.cellNormal}>NW : {data.netWeight} KGS</Text> : null}
                {data.measurement && !data.grossWeight?.includes("MEAS") ? <Text style={s.cellNormal}>MEAS : {data.measurement} CBM</Text> : null}
              </View>
            ) : null}
          </View>
        </View>

        {/* Combined Row: Country of origin / Destination country & Port of loading / Port of unloading */}
        <View style={s.tableRow}>
          <View style={[{ width: "32%", padding: 1.5, borderRightWidth: 0.5, borderRightColor: TC_COLORS.border }]}>
            <Text>{TC.countryOfOriginLabel}</Text>
            <Text>{TC.destinationCountryLabel}</Text>
          </View>
          <View style={[{ width: "20%", padding: 1.5, borderRightWidth: 0.5, borderRightColor: TC_COLORS.border }, s.cellNormal]}>
            <Text>{data.countryOfOrigin || " "}</Text>
            <Text>{data.destinationCountry || " "}</Text>
          </View>
          <View style={[{ width: "23%", padding: 1.5, borderRightWidth: 0.5, borderRightColor: TC_COLORS.border }]}>
            <Text>{TC.portOfLoadingLabel}</Text>
            <Text>{TC.portOfUnloadingLabel}</Text>
          </View>
          <View style={[{ width: "25%", padding: 1.5 }, s.cellNormal]}>
            <Text>{data.portOfLoading || " "}</Text>
            <Text>{data.portOfUnloading || " "}</Text>
          </View>
        </View>

        {/* Row: Target of fumigation & Enclosure type */}
        <View style={s.tableRow}>
          <Text style={[{ width: "32%", padding: 1.5, borderRightWidth: 0.5, borderRightColor: TC_COLORS.border }]}>{TC.targetOfFumigationLabel}</Text>
          <Text style={[{ width: "20%", padding: 1.5, borderRightWidth: 0.5, borderRightColor: TC_COLORS.border }, s.cellNormal]}>{data.targetOfFumigation || " "}</Text>
          <Text style={[{ width: "23%", padding: 1.5, borderRightWidth: 0.5, borderRightColor: TC_COLORS.border }]}>{TC.enclosureTypeLabel}</Text>
          <Text style={[{ width: "25%", padding: 1.5 }, s.cellNormal]}>{data.enclosureType || " "}</Text>
        </View>

        {/* Section: Treatment schedule */}
        <Text style={s.sectionHeader}>{TC.treatmentScheduleHeader}</Text>

        <View style={s.tableGrayRow}>
          <View style={[{ width: "33%", padding: 1.5, borderRightWidth: 0.5, borderRightColor: TC_COLORS.border }]}>
            <Text><Text style={s.cellBold}>{TC.doseRateLabel}</Text>  <Text style={s.cellNormal}>{fmtUnit(data.doseRate, "g/m3")}</Text></Text>
          </View>
          <View style={[{ width: "34%", padding: 1.5, borderRightWidth: 0.5, borderRightColor: TC_COLORS.border }]}>
            <Text><Text style={s.cellBold}>{TC.exposurePeriodLabel}</Text>  <Text style={s.cellNormal}>{fmtUnit(data.exposurePeriod, "(hours)")}</Text></Text>
          </View>
          <View style={[{ width: "33%", padding: 1.5 }]}>
            <Text><Text style={s.cellBold}>{TC.temperatureLabel}</Text>  <Text style={s.cellNormal}>{fmtUnit(data.scheduleTemperature, TC.temperatureUnit)}</Text></Text>
          </View>
        </View>

        {/* Section: Fumigation details */}
        <Text style={s.sectionHeader}>{TC.fumigationDetailsHeader}</Text>

        <View style={s.tableGrayRow}>
          <View style={[{ width: "33%", padding: 1.5, borderRightWidth: 0.5, borderRightColor: TC_COLORS.border }]}>
            <Text><Text style={s.cellBold}>{TC.appliedDoseLabel}</Text>  <Text style={s.cellNormal}>{fmtUnit(data.appliedDose, "g/m3")}</Text></Text>
          </View>
          <View style={[{ width: "34%", padding: 1.5, borderRightWidth: 0.5, borderRightColor: TC_COLORS.border }]}>
            <Text><Text style={s.cellBold}>{TC.exposurePeriodLabel}</Text>  <Text style={s.cellNormal}>{fmtUnit(data.appliedExposurePeriod, "(hours)")}</Text></Text>
          </View>
          <View style={[{ width: "33%", padding: 1.5 }]}>
            <Text><Text style={s.cellBold}>{TC.temperatureLabel}</Text>  <Text style={s.cellNormal}>{fmtUnit(data.appliedTemperature, TC.temperatureUnit)}</Text></Text>
          </View>
        </View>

        {/* Place, Timing, TLV */}
        <View style={[s.tableRow, { marginTop: 2 }]}>
          <Text style={[{ width: "49%", padding: 1.5, textAlign: "right", borderRightWidth: 0.5, borderRightColor: TC_COLORS.border }]}>{TC.placeOfFumigationLabel}</Text>
          <Text style={[{ width: "51%", padding: 1.5 }, s.cellNormal]}>{data.placeOfFumigation || " "}</Text>
        </View>
        <View style={s.tableRow}>
          <View style={[{ width: "49%", padding: 1.5, borderRightWidth: 0.5, borderRightColor: TC_COLORS.border }]}>
            <Text style={{ textAlign: "right" }}>{TC.commencedAtLabel}</Text>
            <Text style={{ textAlign: "right" }}>{TC.completedAtLabel}</Text>
          </View>
          <View style={[{ width: "51%", padding: 1.5 }, s.cellNormal]}>
            <Text>{commencedStr || " "}</Text>
            <Text>{completedStr || " "}</Text>
          </View>
        </View>
        <View style={s.tableRow}>
          <Text style={[{ width: "49%", padding: 1.5, textAlign: "right", borderRightWidth: 0.5, borderRightColor: TC_COLORS.border }]}>{TC.finalTlvLabel}</Text>
          <Text style={[{ width: "51%", padding: 1.5 }, s.cellNormal]}>{fmtNum(data.finalTlvPpm)}</Text>
        </View>

        {/* Declaration */}
        <Text style={s.sectionHeader}>{TC.declarationHeader}</Text>
        <Text style={s.declarationText}>{TC.declarationLine1}</Text>
        <Text style={s.declarationIndent}>{TC.declarationLine2}</Text>
        <Text style={s.declarationIndent}>{TC.declarationLine3}</Text>

        {/* Table 6: Signature Table */}
        <View style={[s.tableRow, { marginTop: 2 }]}>
          <Text style={[{ width: "20%", padding: 2, textAlign: "right", borderRightWidth: 0.5, borderRightColor: TC_COLORS.border }]}>{TC.signatureLabel}</Text>
          <View style={[{ width: "80%", padding: 2, alignItems: "center", justifyContent: "center" }]}>
            {data.signatureUrl ? (
              <Image src={data.signatureUrl} style={s.signatureImage} />
            ) : (
              <Text> </Text>
            )}
          </View>
        </View>
        <View style={s.tableRow}>
          <View style={[{ width: "20%", padding: 1.5, borderRightWidth: 0.5, borderRightColor: TC_COLORS.border }]}>
            <Text style={{ textAlign: "right" }}>{TC.fullNameLabel}</Text>
            <Text style={{ textAlign: "right" }}>{TC.accreditationNumberLabel}</Text>
          </View>
          <View style={[{ width: "40%", padding: 1.5, borderRightWidth: 0.5, borderRightColor: TC_COLORS.border }, s.cellNormal]}>
            <Text>{data.fullName || " "}</Text>
            <Text>{data.accreditationNumber || " "}</Text>
          </View>
          <View style={[{ width: "40%", padding: 1.5 }]}>
            <Text>{TC.dateLabel} <Text style={s.cellNormal}>{sigDate}</Text></Text>
          </View>
        </View>

        {/* Additional Declarations */}
        <Text style={s.sectionHeader}>{TC.additionalDeclarationsHeader}</Text>
        <View style={s.addDeclBox}>
          <Text style={s.cellNormal}>{data.additionalDeclarations || ""}</Text>
        </View>

        {/* Footer Rule & Text */}
        <View style={s.footerRule} fixed />
        <View style={s.footerText} fixed>
          <Text>
            {TC.footerPrefix}
            <Text style={{ fontFamily: "Calibri", fontWeight: "bold" }}>{TC.footerBrand}</Text>
          </Text>
          <Text>
            {TC.footerVerify}
            <Text style={{ color: "#0000ED", textDecoration: "underline" }}>eCert-1785310680-2eb9d8d4-ID0018MB-20260731</Text>
          </Text>
        </View>
      </Page>
    </Document>
  );
};
