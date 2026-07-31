import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { format } from "date-fns";
import { PAGE, FONTS, FONT_SIZES, LINE_HEIGHTS, IMAGE_SIZES, LAYOUT } from "@/lib/certificate-tokens";
import { CERTIFICATE_CONSTANTS } from "@/lib/certificate-constants";
import { CERTIFICATE_STATIC_TEXT as TEXT, CERTIFICATE_FIELD_LABELS as FIELD } from "@/lib/certificate-static-text";
import { QR_IMAGE_DATA_URI } from "@/lib/certificate-assets";
import { BilingualField } from "./BilingualField";
import type { CertificateInput } from "@/lib/certificate-schema";

// Single layout source for both the live preview and the exported PDF.
// Structure and metrics mirror Template GC.docx 1:1 (see lib/certificate-tokens.ts).
const styles = StyleSheet.create({
  page: {
    paddingTop: PAGE.paddingTop,
    paddingBottom: PAGE.paddingBottom,
    paddingLeft: PAGE.paddingLeft,
    paddingRight: PAGE.paddingRight,
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.body,
  },
  // Shared text roles
  idText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.body,
    lineHeight: LINE_HEIGHTS.body,
    textDecoration: "underline", // BodyText style carries underline in the template
  },
  enText: {
    fontFamily: FONTS.italic,
    fontSize: FONT_SIZES.body,
    lineHeight: LINE_HEIGHTS.body,
  },
  centered: { textAlign: "center" },
  // Letterhead
  logo: {
    width: IMAGE_SIZES.logo.width,
    height: IMAGE_SIZES.logo.height,
    marginLeft: IMAGE_SIZES.logo.marginLeft,
  },
  logoPlaceholder: {
    width: IMAGE_SIZES.logo.width,
    height: IMAGE_SIZES.logo.height,
    marginLeft: IMAGE_SIZES.logo.marginLeft,
  },
  // Header band: centered title + registration/date block on the right
  headerBand: {
    position: "relative",
    height: LAYOUT.header.height,
    marginTop: 0.5,
  },
  titleBlock: {
    position: "absolute",
    left: 0,
    right: 0,
    top: LAYOUT.header.titleTop,
    alignItems: "center",
  },
  titleId: {
    fontFamily: FONTS.bodyBold,
    fontSize: FONT_SIZES.title,
    lineHeight: LINE_HEIGHTS.title,
    textDecoration: "underline",
  },
  titleEn: {
    fontFamily: FONTS.italic,
    fontSize: FONT_SIZES.subtitle,
    lineHeight: LINE_HEIGHTS.subtitle,
  },
  regLabelBox: {
    position: "absolute",
    left: LAYOUT.header.labelLeft,
    width: LAYOUT.header.labelWidth,
    top: LAYOUT.header.regTop,
  },
  regLabelId: { textAlign: "right" },
  regLabelEn: { paddingLeft: LAYOUT.header.regEnLeft - LAYOUT.header.labelLeft },
  dateLabelBox: {
    position: "absolute",
    left: LAYOUT.header.labelLeft,
    width: LAYOUT.header.labelWidth,
    top: LAYOUT.header.dateTop,
  },
  dateLabelEn: { paddingLeft: LAYOUT.header.dateEnLeft - LAYOUT.header.labelLeft },
  regValue: {
    position: "absolute",
    left: LAYOUT.header.valueX,
    top: LAYOUT.header.regTop + 3,
    fontSize: FONT_SIZES.body,
    lineHeight: LINE_HEIGHTS.body,
  },
  dateValue: {
    position: "absolute",
    left: LAYOUT.header.valueX,
    top: LAYOUT.header.dateTop + 1,
    fontSize: FONT_SIZES.body,
    lineHeight: LINE_HEIGHTS.body,
  },
  // Headings + intro
  headingBlock: { marginTop: 10, paddingLeft: LAYOUT.indent },
  heading2: {
    fontFamily: FONTS.bodyBold,
    fontSize: FONT_SIZES.body,
    lineHeight: LINE_HEIGHTS.body,
  },
  heading3: {
    fontFamily: FONTS.boldItalic,
    fontSize: FONT_SIZES.body,
    lineHeight: LINE_HEIGHTS.body,
  },
  intro: { marginTop: 10, paddingLeft: LAYOUT.indent },
  // Field list
  fields: { marginTop: 12, paddingLeft: LAYOUT.fieldIndent },
  // Declarations
  decl: { marginTop: 4, paddingLeft: LAYOUT.indent },
  declFirst: { marginTop: 6, paddingLeft: LAYOUT.indent },
  // Gas concentration row
  gasRow: { position: "relative", marginTop: 8 },
  gasLabelId: { paddingLeft: LAYOUT.gas.labelIndent },
  gasLabelEn: { paddingLeft: LAYOUT.gas.labelEnIndent },
  gasValue: {
    position: "absolute",
    left: LAYOUT.valueX,
    top: 0,
    fontSize: FONT_SIZES.body,
    lineHeight: LINE_HEIGHTS.body,
  },
  // "Pelaksana Fumigasi," block
  signer: { marginTop: 10, paddingLeft: LAYOUT.signer.indent },
  // Bottom band: QR + stamp + signature columns
  bottomBand: { position: "relative", height: 72, marginTop: 4 },
  qr: {
    position: "absolute",
    left: IMAGE_SIZES.qr.marginLeft,
    top: 0,
    width: IMAGE_SIZES.qr.width,
    height: IMAGE_SIZES.qr.height,
  },
  stampImage: {
    position: "absolute",
    left: LAYOUT.stampLabel.left + (LAYOUT.stampLabel.width - IMAGE_SIZES.stamp.width) / 2,
    top: 2,
    width: IMAGE_SIZES.stamp.width,
    height: IMAGE_SIZES.stamp.height,
  },
  signatureImage: {
    position: "absolute",
    left: LAYOUT.signatureCol.left + (LAYOUT.signatureCol.width - IMAGE_SIZES.signature.width) / 2,
    top: 26,
    width: IMAGE_SIZES.signature.width,
    height: IMAGE_SIZES.signature.height,
  },
  stampLabelBox: {
    position: "absolute",
    left: LAYOUT.stampLabel.left,
    width: LAYOUT.stampLabel.width,
    top: 58,
  },
  signatureBox: {
    position: "absolute",
    left: LAYOUT.signatureCol.left,
    width: LAYOUT.signatureCol.width,
    top: 58,
  },
  // Page footer (fixed to the page like footer1.xml)
  footerRule: {
    position: "absolute",
    left: LAYOUT.footer.ruleLeft,
    top: LAYOUT.footer.ruleTop,
    width: LAYOUT.footer.ruleWidth,
    height: 0.75,
    backgroundColor: "#000000",
  },
  footerText: {
    position: "absolute",
    left: LAYOUT.footer.textLeft,
    top: LAYOUT.footer.textTop,
  },
  footerLine: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.footer,
    lineHeight: LINE_HEIGHTS.footer,
  },
  footerSerif: {
    fontFamily: FONTS.footerSerif,
    fontSize: FONT_SIZES.footer,
  },
  footerLink: {
    fontFamily: FONTS.footerSerif,
    fontSize: FONT_SIZES.footer,
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
  const dateTime = (d: Date | string) => format(new Date(d), "dd/MM/yyyy \u2013 HH:mm");

  return (
    <Document>
      <Page size={PAGE.size} style={styles.page} wrap={false}>
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
          <Text style={styles.dateValue}>: {format(new Date(data.certificateDate), "dd/MM/yyyy")}</Text>
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
          <Text style={styles.gasValue}>: {data.gasLevelPpm} ppm</Text>
        </View>

        {/* Fumigation company signer */}
        <View style={styles.signer}>
          <Text style={styles.idText}>{TEXT.signerLabelId}</Text>
          <Text style={styles.enText}>{TEXT.signerLabelEn}</Text>
        </View>

        {/* QR + stamp + signature */}
        <View style={styles.bottomBand}>
          <Image src={QR_IMAGE_DATA_URI} style={styles.qr} />
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
