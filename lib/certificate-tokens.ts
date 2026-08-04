// Layout tokens extracted from Template_GC.docx (word/document.xml).
// All values are PDF points: 1 pt = 20 twips, 1 pt = 12700 EMU.
// This file is the single home for certificate layout constants (AGENTS.md rule 5).

export const PAGE = {
  size: "A5" as const, // w:pgSz 8400 x 11900 twips = 420 x 595 pt
  paddingTop: 19, // w:pgMar top 380
  paddingBottom: 48, // w:pgMar bottom 960
  paddingLeft: 14.15, // w:pgMar left 283
  paddingRight: 14.15, // w:pgMar right 283
  contentWidth: 391.7, // 8400 - 2*283 twips
};

export const FONTS = {
  body: "Helvetica", // "Arial MT" in the source doc (metric-compatible substitute)
  bodyBold: "Helvetica-Bold", // Arial bold (headings, title)
  italic: "Helvetica-Oblique", // Arial italic (English labels)
  boldItalic: "Helvetica-BoldOblique", // Arial bold italic ("To whom it may concern")
  footerSerif: "Times-Roman", // "Cambria" runs in the page footer
};

export const FONT_SIZES = {
  title: 8, // w:sz 16 (half-points)
  subtitle: 7, // w:sz 14
  body: 6, // w:sz 12
  footer: 5, // w:sz 10
};

// react-pdf lineHeight = multiplier of font size (source uses exact twip line rules)
export const LINE_HEIGHTS = {
  title: 1.1, // 176 tw = 8.8 pt / 8 pt
  subtitle: 1.093, // 153 tw = 7.65 pt / 7 pt
  body: 1.075, // 129 tw = 6.45 pt / 6 pt
  footer: 1.11, // 111 tw = 5.55 pt / 5 pt
};

export const IMAGE_SIZES = {
  logo: { width: 380, height: 55.5, marginLeft: 6.1 }, // 4825912 x 704373 EMU, w:ind 122
  qr: { width: 53.65, height: 53.6, marginLeft: 26.6 }, // 681351 x 681037 EMU, w:ind 532
  stamp: { width: 54, height: 54 }, // stamped over the "Cap Perusahaan Fumigasi*" label
  signature: { width: 90, height: 30 }, // drawn above the fumigator name line
};

export const LAYOUT = {
  indent: 6.05, // w:ind 121/122 — headings, intro, declarations
  fieldIndent: 8.35, // w:ind 167 — field label rows
  valueX: 175.3, // ":" column (floating textbox at 2406252 EMU from page edge, minus margin)
  header: {
    height: 49, // 3-column header band under the letterhead
    titleTop: 15,
    labelLeft: 251.55, // "Nomor Registrasi"/"Tanggal" right-aligned box (col2: 4991+40 tw offset)
    labelWidth: 61.35, // col2 width 1227 tw
    regEnLeft: 257.65, // "Registration Number" w:ind 122 inside col2
    dateEnLeft: 260.6, // "Date (dd/mm/yyyy)" w:ind 219 inside col2
    valueX: 320.2, // col3 (6297 tw) + w:ind 107
    regTop: 2.15, // w:spacing before 43
    dateTop: 36, // ~4 blank BodyText lines below the reg number block
  },
  gas: { labelIndent: 66.65, labelEnIndent: 96.05 }, // w:ind 1333 / 1921
  signer: { indent: 310.7 }, // w:ind 6214 — "Pelaksana Fumigasi,"
  stampLabel: { left: 157.15, width: 77.4 }, // col1 4691 tw, centered past w:ind 3143
  signatureCol: { left: 285.35, width: 106.35 }, // col2 at 5334 tw + w:ind 373
  footer: {
    ruleLeft: 20.25, // line shape at 257174 EMU from page edge
    ruleTop: 542.25, // 6886574 EMU from page top
    ruleWidth: 380.25, // 4829175 EMU
    textLeft: 22.3, // footer textbox at 283170 EMU
    textTop: 544.5,
  },
};
