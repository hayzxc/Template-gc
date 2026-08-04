import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { format } from "date-fns";
import { PAGE, FONTS, FONT_SIZES, LINE_HEIGHTS, IMAGE_SIZES, LAYOUT } from "@/lib/certificate-tokens";
import { CERTIFICATE_CONSTANTS } from "@/lib/certificate-constants";
import { CERTIFICATE_STATIC_TEXT as TEXT, CERTIFICATE_FIELD_LABELS as FIELD } from "@/lib/certificate-static-text";
import { BilingualField } from "./BilingualField";
import type { CertificateInput } from "@/lib/certificate-schema";

// Single layout source for both the live preview and the exported PDF.
// Structure and metrics mirror Template GC.docx 1:1 (see lib/certificate-tokens.ts).
const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 40,
    paddingLeft: 24,
    paddingRight: 24,
    fontFamily: FONTS.body,
    fontSize: 8.5,
  },
  // Shared text roles
  idText: {
    fontFamily: FONTS.body,
    fontSize: 8.5,
    lineHeight: LINE_HEIGHTS.body,
    textDecoration: "underline",
  },
  enText: {
    fontFamily: FONTS.italic,
    fontSize: 8.5,
    lineHeight: LINE_HEIGHTS.body,
  },
  centered: { textAlign: "center" },
  // Letterhead
  logo: {
    width: 480,
    height: 70,
    marginLeft: 8,
  },
  logoPlaceholder: {
    width: 480,
    height: 70,
    marginLeft: 8,
  },
  // Header band: centered title + registration/date block on the right
  headerBand: {
    position: "relative",
    height: 65,
    marginTop: 2,
  },
  titleBlock: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 18,
    alignItems: "center",
  },
  titleId: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    lineHeight: LINE_HEIGHTS.title,
    textDecoration: "underline",
  },
  titleEn: {
    fontFamily: FONTS.italic,
    fontSize: 9.5,
    lineHeight: LINE_HEIGHTS.subtitle,
  },
  regLabelBox: {
    position: "absolute",
    left: 350,
    width: 85,
    top: 3,
  },
  regLabelId: { textAlign: "right" },
  regLabelEn: { paddingLeft: 8 },
  dateLabelBox: {
    position: "absolute",
    left: 350,
    width: 85,
    top: 48,
  },
  dateLabelEn: { paddingLeft: 8 },
  regValue: {
    position: "absolute",
    left: 442,
    top: 6,
    fontSize: 8.5,
    lineHeight: LINE_HEIGHTS.body,
  },
  dateValue: {
    position: "absolute",
    left: 442,
    top: 49,
    fontSize: 8.5,
    lineHeight: LINE_HEIGHTS.body,
  },
  // Headings + intro
  headingBlock: { marginTop: 14, paddingLeft: 8 },
  heading2: {
    fontFamily: FONTS.bodyBold,
    fontSize: 8.5,
    lineHeight: LINE_HEIGHTS.body,
  },
  heading3: {
    fontFamily: FONTS.boldItalic,
    fontSize: 8.5,
    lineHeight: LINE_HEIGHTS.body,
  },
  intro: { marginTop: 14, paddingLeft: 8 },
  // Field list
  fields: { marginTop: 16, paddingLeft: 12 },
  // Declarations
  decl: { marginTop: 6, paddingLeft: 8 },
  declFirst: { marginTop: 8, paddingLeft: 8 },
  // Gas concentration row
  gasRow: { position: "relative", marginTop: 12 },
  gasLabelId: { paddingLeft: 90 },
  gasLabelEn: { paddingLeft: 130 },
  gasValue: {
    position: "absolute",
    left: 245,
    top: 0,
    fontSize: 8.5,
    lineHeight: LINE_HEIGHTS.body,
  },
  // "Pelaksana Fumigasi," block
  signer: { marginTop: 14, paddingLeft: 420 },
  // Bottom band: QR + stamp + signature columns
  bottomBand: { position: "relative", height: 95, marginTop: 8 },
  qr: {
    position: "absolute",
    left: 36,
    top: 0,
    width: 72,
    height: 72,
  },
  stampImage: {
    position: "absolute",
    left: 215,
    top: 2,
    width: 72,
    height: 72,
  },
  signatureImage: {
    position: "absolute",
    left: 390,
    top: 32,
    width: 120,
    height: 40,
  },
  stampLabelBox: {
    position: "absolute",
    left: 200,
    width: 105,
    top: 76,
  },
  signatureBox: {
    position: "absolute",
    left: 380,
    width: 140,
    top: 76,
  },
  // Page footer (fixed to the page like footer1.xml)
  footerRule: {
    position: "absolute",
    left: 24,
    bottom: 30,
    right: 24,
    height: 0.75,
    backgroundColor: "#000000",
  },
  footerText: {
    position: "absolute",
    left: 24,
    bottom: 14,
  },
  footerLine: {
    fontFamily: FONTS.body,
    fontSize: 7,
    lineHeight: LINE_HEIGHTS.footer,
  },
  footerSerif: {
    fontFamily: FONTS.footerSerif,
    fontSize: 7,
  },
  footerLink: {
    fontFamily: FONTS.footerSerif,
    fontSize: 7,
    color: "#0000ED",
    textDecoration: "underline",
  },
});

interface CertificateDocumentProps {
  data: CertificateInput;
  logoUrl?: string;
  stampUrl?: string;
}

export const CertificateDocument: React.FC<CertificateDocumentProps> = ({ data, logoUrl, stampUrl }) => {
  const dateTime = (d?: Date | string | null) => {
    if (!d) return "";
    const dateObj = d instanceof Date ? d : new Date(String(d));
    if (isNaN(dateObj.getTime())) return "";
    return format(dateObj, "dd/MM/yyyy \u2013 HH:mm");
  };

  const dateOnly = (d?: Date | string | null) => {
    if (!d) return "";
    const dateObj = d instanceof Date ? d : new Date(String(d));
    if (isNaN(dateObj.getTime())) return "";
    return format(dateObj, "dd/MM/yyyy");
  };

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={false}>
        {/* Letterhead */}
        {logoUrl ? <Image src={logoUrl} style={styles.logo} /> : <View style={styles.logoPlaceholder} />}

        {/* Title + registration number / date */}
        <View style={styles.headerBand}>
          <View style={styles.titleBlock}>
            <Text style={styles.titleId}>{TEXT.titleId}</Text>
            <Text style={styles.titleEn}>{TEXT.titleEn}</Text>
          </View>
          <View style={styles.regLabelBox}>
            <Text style={[styles.idText, styles.regLabelId]}>{TEXT.regLabelId}</Text>
            <Text style={[styles.enText, styles.regLabelEn]}>{TEXT.regLabelEn}</Text>
          </View>
          <Text style={styles.regValue}>: {CERTIFICATE_CONSTANTS.registrationNumber}</Text>
          <View style={styles.dateLabelBox}>
            <Text style={[styles.idText, styles.regLabelId]}>{TEXT.dateLabelId}</Text>
            <Text style={[styles.enText, styles.dateLabelEn]}>{TEXT.dateLabelEn}</Text>
          </View>
          <Text style={styles.dateValue}>: {dateOnly(data.certificateDate)}</Text>
        </View>

        {/* Headings */}
        <View style={styles.headingBlock}>
          <Text style={styles.heading2}>{TEXT.headingId}</Text>
          <Text style={styles.heading3}>{TEXT.headingEn}</Text>
        </View>

        {/* Intro */}
        <View style={styles.intro}>
          <Text style={styles.idText}>{TEXT.introId}</Text>
          <Text style={styles.enText}>{TEXT.introEn}</Text>
        </View>

        {/* Field list */}
        <View style={styles.fields}>
          <BilingualField labelId={FIELD.commodity.id} labelEn={FIELD.commodity.en} value={data.commodity} />
          <BilingualField
            labelId={FIELD.containerNumber.id}
            labelEn={FIELD.containerNumber.en}
            value={data.containerNumber}
          />
          <BilingualField
            labelId={FIELD.carrierVessel.id}
            labelEn={FIELD.carrierVessel.en}
            value={data.carrierVessel}
          />
          <BilingualField
            labelId={FIELD.fumigationArea.id}
            labelEn={FIELD.fumigationArea.en}
            value={data.fumigationArea}
          />
          <BilingualField
            labelId={FIELD.fumigant.id}
            labelEn={FIELD.fumigant.en}
            value={CERTIFICATE_CONSTANTS.fumigant}
          />
          <BilingualField
            labelId={FIELD.commencingAt.id}
            labelEn={FIELD.commencingAt.en}
            value={dateTime(data.commencingAt)}
          />
          <BilingualField
            labelId={FIELD.completedAt.id}
            labelEn={FIELD.completedAt.en}
            value={dateTime(data.completedAt)}
          />
        </View>

        {/* Declarations */}
        <View style={styles.declFirst}>
          <Text style={styles.idText}>{TEXT.decl1Id}</Text>
          <Text style={styles.enText}>{TEXT.decl1En}</Text>
        </View>
        <View style={styles.decl}>
          <Text style={styles.idText}>{TEXT.decl2Id}</Text>
          <Text style={styles.enText}>{TEXT.decl2En}</Text>
        </View>

        {/* Gas concentration */}
        <View style={styles.gasRow}>
          <Text style={[styles.idText, styles.gasLabelId]}>{TEXT.gasLabelId}</Text>
          <Text style={[styles.enText, styles.gasLabelEn]}>{TEXT.gasLabelEn}</Text>
          <Text style={styles.gasValue}>
            : {data.gasLevelPpm != null ? `${data.gasLevelPpm} ppm` : ""}
          </Text>
        </View>

        {/* Fumigation company signer */}
        <View style={styles.signer}>
          <Text style={styles.idText}>{TEXT.signerLabelId}</Text>
          <Text style={styles.enText}>{TEXT.signerLabelEn}</Text>
        </View>

        {/* Stamp + signature */}
        <View style={styles.bottomBand}>
          {stampUrl && <Image src={stampUrl} style={styles.stampImage} />}
          {data.fumigatorSignatureUrl ? (
            <Image src={data.fumigatorSignatureUrl} style={styles.signatureImage} />
          ) : null}
          <View style={styles.stampLabelBox}>
            <Text style={[styles.idText, styles.centered]}>{TEXT.stampLabelId}</Text>
            <Text style={[styles.enText, styles.centered]}>{TEXT.stampLabelEn}</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={[styles.idText, styles.centered]}>{data.fumigatorName}</Text>
            <Text style={[styles.enText, styles.centered]}>{TEXT.signatureLabelEn}</Text>
          </View>
        </View>

        {/* Page footer */}
        <View style={styles.footerRule} fixed />
        <View style={styles.footerText} fixed>
          <Text style={styles.footerLine}>
            {TEXT.footerPrefix}
            <Text style={styles.footerSerif}>{TEXT.footerBrand}</Text>
          </Text>
          <Text style={styles.footerLine}>
            {TEXT.footerVerify}
            <Text style={styles.footerLink}>{TEXT.footerLink}</Text>
          </Text>
        </View>
      </Page>
    </Document>
  );
};
