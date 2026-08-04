"use client";

import React from "react";
import { format } from "date-fns";
import { TREATMENT_CONSTANTS as TC } from "@/lib/treatment-constants";
import { TREATMENT_HEADER_IMAGE_DATA_URI } from "@/lib/treatment-assets";
import type { TreatmentCertificateInput } from "@/lib/treatment-schema";

interface TreatmentLivePreviewProps {
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

export const TreatmentLivePreview: React.FC<TreatmentLivePreviewProps> = React.memo(({ data }) => {
  const dateIssued = safeFmt(data.dateIssued, "dd/MM/yyyy");
  const commencedStr = safeFmt(data.commencedAt, "dd/MM/yyyy – HH:mm");
  const completedStr = safeFmt(data.completedAt, "dd/MM/yyyy – HH:mm");
  const sigDate = safeFmt(data.signatureDate, "dd/MM/yyyy");

  return (
    <div className="w-[420px] min-h-[595px] bg-white text-black font-['Calibri',sans-serif] text-[6pt] leading-[1.2] p-[12pt_10pt_12pt_10pt] box-border relative shadow-lg rounded select-none mx-auto flex flex-col border border-gray-300 overflow-hidden justify-between">
      <div>
        {/* Company Letterhead Image (Omitted if hideLetterhead is true) */}
        {!data.hideLetterhead && (
          <div className="mb-2 w-full pl-1.5">
            <img
              src={TREATMENT_HEADER_IMAGE_DATA_URI}
              alt="Company Letterhead"
              className="w-full h-auto object-contain block"
            />
          </div>
        )}

        {/* Top Right: Serial No. (BOLD VALUE) and Date Issued (NORMAL VALUE) */}
        <div className="text-right text-[9px] mb-1.5 leading-tight space-y-0.5">
          <div>
            <span className="font-normal">Serial No.</span> &nbsp;<span className="font-bold">{data.serialNo || ""}</span>
          </div>
          <div>
            <span className="font-normal">Date issued</span> <span className="text-[7.5px] text-gray-600">(dd/mm/yyyy)</span> &nbsp;<span className="font-normal">{dateIssued}</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-[#0A5394] font-bold underline text-[12px] leading-tight mb-2">
          {TC.title}
        </div>

        {/* Table 1: Certificate number & Treatment provider ID number (ONLY Treatment Provider ID IS BOLD) */}
        <table className="w-full border-collapse mb-2.5 border border-black text-[9px]">
          <thead>
            <tr>
              <th className="bg-black text-white font-bold px-2 py-1 text-left w-1/2 border-r border-black">
                {TC.certificateNumberLabel}
              </th>
              <th className="bg-black text-white font-bold px-2 py-1 text-left w-1/2">
                {TC.treatmentProviderIdLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-2 py-1 font-normal border-r border-black min-h-[20px]">{data.certificateNo || "\u00A0"}</td>
              <td className="px-2 py-1 font-bold">{data.treatmentProviderId || "ID0018MB"}</td>
            </tr>
          </tbody>
        </table>

        {/* Section: Consignment details */}
        <div className="text-[#0A5394] font-bold text-[10.5px] mt-1.5 mb-1 pt-0.5 pb-0.5 border-t border-b border-[#0A5394] border-t-black">
          {TC.consignmentDetailsHeader}
        </div>

        <table className="w-full border-collapse mb-2.5 border border-black text-[8.5px]">
          <tbody>
            {/* Row 1: Consignment link */}
            <tr className="border-b border-black">
              <td className="w-[32%] px-2 py-1 font-normal align-top border-r border-black">
                {TC.consignmentLinkLabel}
              </td>
              <td className="w-[68%] px-2 py-1 align-top space-y-0.5">
                <div><span className="font-normal">{TC.relatedDocumentNoLabel}</span> <span className="font-normal">{data.relatedDocumentNo}</span></div>
                <div><span className="font-normal">{TC.containersLabel}</span> <span className="font-normal">{data.containers}</span></div>
                <div><span className="font-normal">{TC.consigneeLabel}</span></div>
                <div className="font-normal whitespace-pre-wrap pl-2">{[data.consigneeName, data.consigneeAddress].filter(Boolean).join("\n")}</div>
                {data.notifyParty && (
                  <div className="mt-1">
                    <div><span className="font-normal">{TC.notifyPartyLabel}</span></div>
                    <div className="font-normal whitespace-pre-wrap pl-2">{data.notifyParty}</div>
                  </div>
                )}
              </td>
            </tr>

            {/* Row 2: Seal & Carrier */}
            <tr className="border-b border-black">
              <td className="px-2 py-1 font-normal align-top border-r border-black">
                {TC.sealNumbersLabel}
              </td>
              <td className="px-2 py-1 align-top space-y-0.5">
                <div><span className="font-normal">Seal numbers :</span> <span className="font-normal">{data.sealNumbers}</span></div>
                <div><span className="font-normal">Carrier/vessel :</span> <span className="font-normal">{data.carrierVessel}</span></div>
              </td>
            </tr>

            {/* Row 3: Client name and address */}
            <tr className="border-b border-black">
              <td className="px-2 py-1 font-normal align-top border-r border-black">
                {TC.clientNameLabel}
              </td>
              <td className="px-2 py-1 align-top font-normal whitespace-pre-wrap">
                {[data.clientName, data.clientAddress].filter(Boolean).join("\n") || "\u00A0"}
              </td>
            </tr>

            {/* Row 4: Commodity description */}
            <tr className="border-b border-black">
              <td className="w-[32%] px-2 py-2 font-normal align-middle border-r border-black">
                {TC.commodityLabel}
              </td>
              <td className="w-[68%] px-2 py-2 align-top font-normal whitespace-pre-wrap">
                <div>{data.commodity || "\u00A0"}</div>
                {(data.grossWeight || data.netWeight || data.measurement) && (
                  <div className="mt-2 whitespace-pre-wrap space-y-0.5">
                    {data.grossWeight && (
                      <div>
                        {data.grossWeight.includes("GW") || data.grossWeight.includes(":") || data.grossWeight.includes("\n")
                          ? data.grossWeight
                          : `GW : ${data.grossWeight} KGS`}
                      </div>
                    )}
                    {data.netWeight && !data.grossWeight?.includes("NW") && <div>NW : {data.netWeight} KGS</div>}
                    {data.measurement && !data.grossWeight?.includes("MEAS") && <div>MEAS : {data.measurement} CBM</div>}
                  </div>
                )}
              </td>
            </tr>

            {/* Row 5: Country of Origin / Destination Country & Port of Loading / Port of Unloading */}
            <tr className="border-b border-black">
              <td className="w-[32%] px-2 py-1 font-normal border-r border-black align-top">
                <div>{TC.countryOfOriginLabel}</div>
                <div>{TC.destinationCountryLabel}</div>
              </td>
              <td className="w-[20%] px-2 py-1 font-normal border-r border-black align-top">
                <div>{data.countryOfOrigin || "\u00A0"}</div>
                <div>{data.destinationCountry || "\u00A0"}</div>
              </td>
              <td className="w-[23%] px-2 py-1 font-normal border-r border-black align-top">
                <div>{TC.portOfLoadingLabel}</div>
                <div>{TC.portOfUnloadingLabel}</div>
              </td>
              <td className="w-[25%] px-2 py-1 font-normal align-top">
                <div>{data.portOfLoading || "\u00A0"}</div>
                <div>{data.portOfUnloading || "\u00A0"}</div>
              </td>
            </tr>

            {/* Row 6: Target of fumigation & Enclosure type */}
            <tr>
              <td className="px-2 py-1 font-normal border-r border-black">{TC.targetOfFumigationLabel}</td>
              <td className="px-2 py-1 font-normal border-r border-black">{data.targetOfFumigation || "\u00A0"}</td>
              <td className="px-2 py-1 font-normal border-r border-black">{TC.enclosureTypeLabel}</td>
              <td className="px-2 py-1 font-normal">{data.enclosureType || "\u00A0"}</td>
            </tr>
          </tbody>
        </table>

        {/* Section: Treatment schedule */}
        <div className="text-[#0A5394] font-bold text-[10.5px] mb-1 pb-0.5 border-b border-[#0A5394]">
          {TC.treatmentScheduleHeader}
        </div>

        <table className="w-full border-collapse mb-2.5 border border-black text-[8.5px] bg-[#EFEFEF]">
          <tbody>
            <tr>
              <td className="px-2 py-1 border-r border-black w-[33%]">
                <span className="font-bold">{TC.doseRateLabel}</span> &nbsp; <span className="font-normal">{fmtUnit(data.doseRate, "g/m3")}</span>
              </td>
              <td className="px-2 py-1 border-r border-black w-[34%]">
                <span className="font-bold">{TC.exposurePeriodLabel}</span> &nbsp; <span className="font-normal">{fmtUnit(data.exposurePeriod, "(hours)")}</span>
              </td>
              <td className="px-2 py-1 w-[33%]">
                <span className="font-bold">{TC.temperatureLabel}</span> &nbsp; <span className="font-normal">{fmtUnit(data.scheduleTemperature, TC.temperatureUnit)}</span>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Section: Fumigation details */}
        <div className="text-[#0A5394] font-bold text-[10.5px] mb-1 pb-0.5 border-b border-[#0A5394]">
          {TC.fumigationDetailsHeader}
        </div>

        <table className="w-full border-collapse mb-2.5 border border-black text-[8.5px] bg-[#EFEFEF]">
          <tbody>
            <tr>
              <td className="px-2 py-1 border-r border-black w-[33%]">
                <span className="font-bold">{TC.appliedDoseLabel}</span> &nbsp; <span className="font-normal">{fmtUnit(data.appliedDose, "g/m3")}</span>
              </td>
              <td className="px-2 py-1 border-r border-black w-[34%]">
                <span className="font-bold">{TC.exposurePeriodLabel}</span> &nbsp; <span className="font-normal">{fmtUnit(data.appliedExposurePeriod, "(hours)")}</span>
              </td>
              <td className="px-2 py-1 w-[33%]">
                <span className="font-bold">{TC.temperatureLabel}</span> &nbsp; <span className="font-normal">{fmtUnit(data.appliedTemperature, TC.temperatureUnit)}</span>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Table: Place of fumigation & Timings */}
        <table className="w-full border-collapse mb-2.5 border border-black text-[8.5px]">
          <tbody>
            <tr className="border-b border-black">
              <td className="w-[49%] px-2 py-1 text-right font-normal border-r border-black align-top">{TC.placeOfFumigationLabel}</td>
              <td className="w-[51%] px-2 py-1 font-normal align-top">{data.placeOfFumigation || "\u00A0"}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="px-2 py-1 text-right font-normal border-r border-black align-top space-y-0.5">
                <div>{TC.commencedAtLabel}</div>
                <div>{TC.completedAtLabel}</div>
              </td>
              <td className="px-2 py-1 font-normal align-top space-y-0.5">
                <div>{commencedStr || "\u00A0"}</div>
                <div>{completedStr || "\u00A0"}</div>
              </td>
            </tr>
            <tr>
              <td className="px-2 py-1 text-right font-normal border-r border-black">{TC.finalTlvLabel}</td>
              <td className="px-2 py-1 font-normal">{fmtNum(data.finalTlvPpm)}</td>
            </tr>
          </tbody>
        </table>

        {/* Section: Declaration */}
        <div className="text-[#0A5394] font-bold text-[10.5px] mb-1 pb-0.5 border-b border-[#0A5394]">
          {TC.declarationHeader}
        </div>
        <div className="text-[8px] leading-snug mb-2.5 space-y-0.5">
          <div className="font-normal">{TC.declarationLine1}</div>
          <div className="pl-4 font-normal">{TC.declarationLine2}</div>
          <div className="pl-4 font-normal">{TC.declarationLine3}</div>
        </div>

        {/* Table 6: Signature & Signatory */}
        <table className="w-full border-collapse mb-2.5 border border-black text-[8.5px]">
          <tbody>
            {/* Row 1: Signature */}
            <tr className="border-b border-black">
              <td className="w-[20%] px-2 py-3 text-right font-normal border-r border-black align-middle">{TC.signatureLabel}</td>
              <td colSpan={2} className="w-[80%] px-2 py-1 align-middle text-center min-h-[36px]">
                {data.signatureUrl ? (
                  <img src={data.signatureUrl} alt="Signature" className="h-[32px] object-contain mx-auto" />
                ) : (
                  <div className="h-[32px]" />
                )}
              </td>
            </tr>
            {/* Row 2: Full name / Accreditation number (stacked in 1 cell) | Date */}
            <tr>
              <td className="w-[20%] px-2 py-1 text-right font-normal border-r border-black align-top space-y-1">
                <div>{TC.fullNameLabel}</div>
                <div>{TC.accreditationNumberLabel}</div>
              </td>
              <td className="w-[40%] px-2 py-1 font-normal border-r border-black align-top space-y-1">
                <div>{data.fullName || "\u00A0"}</div>
                <div>{data.accreditationNumber || "\u00A0"}</div>
              </td>
              <td className="w-[40%] px-2 py-1 align-top">
                <span className="font-normal">{TC.dateLabel}</span> &nbsp; <span className="font-normal">{sigDate}</span>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Section: Additional Declarations */}
        <div className="text-[#0A5394] font-bold text-[10.5px] mb-1 pb-0.5 border-b border-[#0A5394]">
          {TC.additionalDeclarationsHeader}
        </div>
        <div className="min-h-[25px] py-1 text-[8px] whitespace-pre-wrap font-normal">
          {data.additionalDeclarations || ""}
        </div>
      </div>

      {/* Footer Rule & Text */}
      <div className="mt-2 pt-1 border-t border-black text-[7.5px] leading-tight">
        <div>
          {TC.footerPrefix}<span className="font-serif font-bold">{TC.footerBrand}</span>{TC.footerVerify}
        </div>
      </div>
    </div>
  );
});

TreatmentLivePreview.displayName = "TreatmentLivePreview";
