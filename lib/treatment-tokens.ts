// Layout tokens extracted 1:1 from certificate_reference.docx (word/document.xml).
// Page size: A5 (8400 x 11900 twips = 420 x 595 pt).
// All values are PDF points (1 pt = 20 twips).

export const TC_PAGE = {
  size: "A4" as const,
  paddingTop: 25,
  paddingBottom: 14,
  paddingLeft: 7.05,
  paddingRight: 7.05,
  contentWidth: 580,
};

export const TC_FONTS = {
  body: "Calibri",
  bodyBold: "Calibri",
  italic: "Calibri",
  boldItalic: "Calibri",
};

export const TC_FONT_SIZES = {
  companyName: 12,
  companySubtitle: 5.5,
  title: 8.5,
  sectionHeader: 7.5,
  body: 6, // Calibri 6pt
  small: 5.5,
};

export const TC_COLORS = {
  sectionBlue: "#0A5394", // Primary heading blue in certificate_reference.docx
  table1HeaderBg: "#000000", // Table 1 header cell background (BLACK)
  table1HeaderText: "#FFFFFF",
  tableGrayBg: "#EFEFEF", // Table 3 & 4 header background (LIGHT GRAY)
  border: "#000000",
  lightBorder: "#666666",
};
