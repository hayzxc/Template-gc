"use client";

import React from "react";
import { format } from "date-fns";
import { CERTIFICATE_CONSTANTS } from "@/lib/certificate-constants";
import { CERTIFICATE_STATIC_TEXT as TEXT, CERTIFICATE_FIELD_LABELS as FIELD } from "@/lib/certificate-static-text";
import type { CertificateInput } from "@/lib/certificate-schema";

interface CertificateLivePreviewProps {
  data: CertificateInput;
  logoUrl?: string;
  stampUrl?: string;
}

const safeFormatDate = (d: Date | string | null | undefined, fmtStr: string) => {
  try {
    if (!d) return "";
    const dateObj = d instanceof Date ? d : new Date(String(d));
    if (isNaN(dateObj.getTime())) return "";
    return format(dateObj, fmtStr);
  } catch {
    return "";
  }
};

export const CertificateLivePreview: React.FC<CertificateLivePreviewProps> = React.memo(({
  data,
  logoUrl,
  stampUrl,
}) => {
  const formattedDate = safeFormatDate(data.certificateDate, "dd/MM/yyyy");
  const commencingStr = safeFormatDate(data.commencingAt, "dd/MM/yyyy \u2013 HH:mm");
  const completedStr = safeFormatDate(data.completedAt, "dd/MM/yyyy \u2013 HH:mm");

  const fields = [
    { labelId: FIELD.commodity.id, labelEn: FIELD.commodity.en, value: data.commodity },
    { labelId: FIELD.containerNumber.id, labelEn: FIELD.containerNumber.en, value: data.containerNumber },
    { labelId: FIELD.carrierVessel.id, labelEn: FIELD.carrierVessel.en, value: data.carrierVessel },
    { labelId: FIELD.fumigationArea.id, labelEn: FIELD.fumigationArea.en, value: data.fumigationArea },
    { labelId: FIELD.fumigant.id, labelEn: FIELD.fumigant.en, value: CERTIFICATE_CONSTANTS.fumigant },
    { labelId: FIELD.commencingAt.id, labelEn: FIELD.commencingAt.en, value: commencingStr },
    { labelId: FIELD.completedAt.id, labelEn: FIELD.completedAt.en, value: completedStr },
  ];

  return (
    <div className="w-[595px] min-h-[842px] bg-white text-black font-sans text-[9.5px] leading-[1.2] p-[20pt_18pt_40pt_18pt] box-border relative shadow-lg rounded select-none mx-auto flex flex-col justify-between overflow-hidden border border-gray-300">
      <div>
        {/* Letterhead */}
        <div className="h-[36px] mb-1">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-full object-contain" />
          ) : (
            <div className="h-full w-[200px]" />
          )}
        </div>

        {/* Header Band */}
        <div className="relative min-h-[38px] mt-1 mb-2">
          {/* Centered Title */}
          <div className="w-full text-center">
            <h1 className="font-bold underline text-[9.5px] leading-tight uppercase">{TEXT.titleId}</h1>
            <h2 className="italic text-[8.5px] leading-tight uppercase">{TEXT.titleEn}</h2>
          </div>
          {/* Reg & Date on right */}
          <div className="absolute right-0 top-0 text-[8px] text-right font-sans">
            <div>
              <span className="underline">{TEXT.regLabelId}</span>
              <span className="ml-1">: {CERTIFICATE_CONSTANTS.registrationNumber}</span>
              <div className="italic text-[7px] text-left pl-2">{TEXT.regLabelEn}</div>
            </div>
            <div className="mt-1">
              <span className="underline">{TEXT.dateLabelId}</span>
              <span className="ml-1">: {formattedDate}</span>
              <div className="italic text-[7px] text-left pl-2">{TEXT.dateLabelEn}</div>
            </div>
          </div>
        </div>

        {/* Headings */}
        <div className="mt-2 pl-[4pt]">
          <div className="font-bold text-[8.5px]">{TEXT.headingId}</div>
          <div className="font-bold italic text-[8.5px]">{TEXT.headingEn}</div>
        </div>

        {/* Intro */}
        <div className="mt-2 pl-[4pt]">
          <div className="underline text-[8.5px]">{TEXT.introId}</div>
          <div className="italic text-[8.5px]">{TEXT.introEn}</div>
        </div>

        {/* Field List */}
        <div className="mt-[6pt] pl-[6pt] space-y-[4pt]">
          {fields.map((f, idx) => (
            <div key={idx} className="flex text-[8.5px]">
              <div className="w-[165px] shrink-0 pr-1">
                <div className="underline">{f.labelId}</div>
                <div className="italic">{f.labelEn}</div>
              </div>
              <div className="shrink-0 mr-1.5">:</div>
              <div className="flex-1 whitespace-pre-wrap break-words font-sans">
                {f.value || <span className="opacity-0">.</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Declarations */}
        <div className="mt-[6pt] pl-[4pt] space-y-1.5">
          <div>
            <div className="underline text-[8.5px]">{TEXT.decl1Id}</div>
            <div className="italic text-[8.5px]">{TEXT.decl1En}</div>
          </div>
          <div>
            <div className="underline text-[8.5px]">{TEXT.decl2Id}</div>
            <div className="italic text-[8.5px]">{TEXT.decl2En}</div>
          </div>
        </div>

        {/* Gas Level Row */}
        <div className="mt-[8pt] pl-[4pt] flex relative text-[8.5px]">
          <div className="w-[165px] shrink-0">
            <div className="underline">{TEXT.gasLabelId}</div>
            <div className="italic">{TEXT.gasLabelEn}</div>
          </div>
          <div>: {data.gasLevelPpm != null ? `${data.gasLevelPpm} ppm` : ""}</div>
        </div>

        {/* Signer Block */}
        <div className="mt-[8pt] pl-[200px] text-[8.5px]">
          <div className="underline">{TEXT.signerLabelId}</div>
          <div className="italic">{TEXT.signerLabelEn}</div>
        </div>

        {/* Bottom Stamp + Signature Band */}
        <div className="mt-[6pt] relative h-[52px] flex items-end justify-between px-2">
          {/* Spacer */}
          <div className="w-[48px] h-[48px]" />

          {/* Stamp */}
          <div className="text-center w-[100px] relative">
            {stampUrl && (
              <img src={stampUrl} alt="Stamp" className="absolute -top-7 left-1/2 -translate-x-1/2 w-[44px] h-[44px] object-contain opacity-80" />
            )}
            <div className="underline text-[7.5px]">{TEXT.stampLabelId}</div>
            <div className="italic text-[7.5px]">{TEXT.stampLabelEn}</div>
          </div>

          {/* Signature */}
          <div className="text-center w-[130px] relative">
            {data.fumigatorSignatureUrl && (
              <img src={data.fumigatorSignatureUrl} alt="Signature" className="absolute -top-6 left-1/2 -translate-x-1/2 h-[28px] object-contain" />
            )}
            <div className="underline text-[8.5px] font-bold">{data.fumigatorName || " "}</div>
            <div className="italic text-[7.5px]">{TEXT.signatureLabelEn}</div>
          </div>
        </div>
      </div>

      {/* Footer Rule & Text */}
      <div className="mt-3 pt-1 border-t border-black text-[7px] leading-tight">
        <div>
          {TEXT.footerPrefix}<span className="font-serif font-bold">{TEXT.footerBrand}</span>
        </div>
        <div className="truncate">
          {TEXT.footerVerify}<span className="font-serif text-blue-800 underline">{TEXT.footerLink}</span>
        </div>
      </div>
    </div>
  );
});

CertificateLivePreview.displayName = "CertificateLivePreview";
