import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { FONTS, FONT_SIZES, LINE_HEIGHTS, LAYOUT } from "@/lib/certificate-tokens";

interface BilingualFieldProps {
  labelId: string;
  labelEn: string;
  value: string;
}

// One field row from the template: underlined Indonesian label with the
// italic English label under it, and ": value" at the fixed colon column.
// Parent container already applies LAYOUT.fieldIndent as paddingLeft.
// Real flex columns (not absolute) so multi-line values grow the row and
// push the following rows down, exactly like the Word template does.
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginBottom: 3, // compact spacing to ensure single-page fit
  },
  labels: {
    width: LAYOUT.valueX - LAYOUT.fieldIndent, // labels end exactly at the colon column
    paddingRight: 6, // keep long labels clear of the colon
  },
  labelId: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.body,
    lineHeight: LINE_HEIGHTS.body,
    textDecoration: "underline", // BodyText style is underlined in the template
  },
  labelEn: {
    fontFamily: FONTS.italic,
    fontSize: FONT_SIZES.body,
    lineHeight: LINE_HEIGHTS.body,
  },
  colon: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.body,
    lineHeight: LINE_HEIGHTS.body,
  },
  valueContainer: {
    flex: 1,
  },
  value: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.body,
    lineHeight: LINE_HEIGHTS.body,
  },
});

export const BilingualField: React.FC<BilingualFieldProps> = ({ labelId, labelEn, value }) => {
  const lines = value ? value.split("\n") : [""];

  return (
    <View style={styles.row}>
      <View style={styles.labels}>
        <Text style={styles.labelId}>{labelId}</Text>
        <Text style={styles.labelEn}>{labelEn}</Text>
      </View>
      <Text style={styles.colon}>: </Text>
      <View style={styles.valueContainer}>
        {lines.map((line, idx) => (
          <Text key={idx} style={styles.value}>
            {line || " "}
          </Text>
        ))}
      </View>
    </View>
  );
};
