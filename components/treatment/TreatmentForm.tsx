"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { treatmentCertificateSchema, TreatmentCertificateInput } from "@/lib/treatment-schema";

interface TreatmentFormProps {
  initialValues?: Partial<TreatmentCertificateInput>;
  onSubmit: (data: TreatmentCertificateInput) => Promise<void>;
  onChange?: (data: Partial<TreatmentCertificateInput>) => void;
  isLoading?: boolean;
}

type TreatmentFormValues = z.input<typeof treatmentCertificateSchema>;

const formatDateForInput = (d?: Date | string | null) => {
  if (!d) return "";
  const date = new Date(d as string | number);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

const formatDateTimeForInput = (d?: Date | string | null) => {
  if (!d) return "";
  const date = new Date(d as string | number);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
};

export const TreatmentForm: React.FC<TreatmentFormProps> = React.memo(({
  initialValues,
  onSubmit,
  onChange,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TreatmentFormValues, unknown, TreatmentCertificateInput>({
    resolver: zodResolver(treatmentCertificateSchema),
    defaultValues: {
      hideLetterhead: initialValues?.hideLetterhead ?? false,
      serialNo: initialValues?.serialNo ?? "",
      dateIssued: initialValues?.dateIssued ?? undefined,
      certificateNo: initialValues?.certificateNo ?? "",
      treatmentProviderId: initialValues?.treatmentProviderId ?? "ID0018MB",
      relatedDocumentNo: initialValues?.relatedDocumentNo ?? "",
      containers: initialValues?.containers ?? "",
      consigneeName: initialValues?.consigneeName ?? "",
      consigneeAddress: initialValues?.consigneeAddress ?? "",
      notifyParty: initialValues?.notifyParty ?? "",
      sealNumbers: initialValues?.sealNumbers ?? "",
      carrierVessel: initialValues?.carrierVessel ?? "",
      clientName: initialValues?.clientName ?? "",
      clientAddress: initialValues?.clientAddress ?? "",
      commodity: initialValues?.commodity ?? "",
      grossWeight: initialValues?.grossWeight ?? "",
      netWeight: initialValues?.netWeight ?? "",
      measurement: initialValues?.measurement ?? "",
      countryOfOrigin: initialValues?.countryOfOrigin ?? "",
      destinationCountry: initialValues?.destinationCountry ?? "",
      portOfLoading: initialValues?.portOfLoading ?? "",
      portOfUnloading: initialValues?.portOfUnloading ?? "",
      targetOfFumigation: initialValues?.targetOfFumigation ?? "",
      enclosureType: initialValues?.enclosureType ?? "",
      doseRate: initialValues?.doseRate ?? undefined,
      exposurePeriod: initialValues?.exposurePeriod ?? undefined,
      scheduleTemperature: initialValues?.scheduleTemperature ?? undefined,
      appliedDose: initialValues?.appliedDose ?? undefined,
      appliedExposurePeriod: initialValues?.appliedExposurePeriod ?? undefined,
      appliedTemperature: initialValues?.appliedTemperature ?? undefined,
      placeOfFumigation: initialValues?.placeOfFumigation ?? "",
      commencedAt: initialValues?.commencedAt ?? undefined,
      completedAt: initialValues?.completedAt ?? undefined,
      finalTlvPpm: initialValues?.finalTlvPpm ?? undefined,
      fullName: initialValues?.fullName ?? "",
      accreditationNumber: initialValues?.accreditationNumber ?? "",
      signatureDate: initialValues?.signatureDate ?? undefined,
      signatureUrl: initialValues?.signatureUrl ?? "",
    },
  });

  React.useEffect(() => {
    if (onChange) {
      const subscription = watch((value) => {
        onChange(value as Partial<TreatmentCertificateInput>);
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, onChange]);

  const inputClass = "mt-1 block w-full rounded-md border-gray-300 p-2 border shadow-sm text-sm";
  const labelClass = "block font-medium text-gray-700 text-sm";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl text-sm">
      {/* Header Section */}
      <fieldset className="border border-gray-200 rounded-md p-4 space-y-3">
        <legend className="text-sm font-semibold text-gray-600 px-2">Header</legend>
        <div className="flex items-center space-x-2 pb-1 border-b border-gray-100">
          <input
            type="checkbox"
            id="hideLetterhead"
            {...register("hideLetterhead")}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="hideLetterhead" className="text-sm text-gray-700 font-medium cursor-pointer">
            🚫 Hilangkan Kop Perusahaan (Hide Letterhead)
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Serial No.</label>
            <input type="text" {...register("serialNo")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Date Issued</label>
            <input type="date" defaultValue={formatDateForInput(initialValues?.dateIssued)} {...register("dateIssued")} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Certificate Number</label>
            <input type="text" {...register("certificateNo")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Treatment Provider ID Number</label>
            <input type="text" {...register("treatmentProviderId")} className={inputClass} />
          </div>
        </div>
      </fieldset>

      {/* Consignment Details */}
      <fieldset className="border border-gray-200 rounded-md p-4 space-y-3">
        <legend className="text-sm font-semibold text-gray-600 px-2">Consignment Details</legend>
        <div>
          <label className={labelClass}>Related Document Number</label>
          <input type="text" {...register("relatedDocumentNo")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Containers</label>
          <textarea rows={2} {...register("containers")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Consignee Name and Address</label>
          <textarea rows={3} {...register("consigneeName")} placeholder="Consignee Name & Address" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Notify Party</label>
          <textarea rows={3} {...register("notifyParty")} placeholder="e.g. SAME AS CONSIGNEE" className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Seal Numbers</label>
            <input type="text" {...register("sealNumbers")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Carrier/Vessel</label>
            <input type="text" {...register("carrierVessel")} className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Client Name and Address</label>
          <textarea rows={3} {...register("clientName")} placeholder="Client Name & Address" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Commodity Description and Quantity</label>
          <textarea rows={3} {...register("commodity")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>GW / NW / MEAS</label>
          <textarea
            rows={3}
            {...register("grossWeight")}
            placeholder={`GW : 10,780.00 KGS\nNW : 10,200 KGS\nMEAS : 55.00 CBM`}
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Country of Origin</label>
            <input type="text" {...register("countryOfOrigin")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Destination Country</label>
            <input type="text" {...register("destinationCountry")} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Port of Loading</label>
            <input type="text" {...register("portOfLoading")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Port of Unloading</label>
            <input type="text" {...register("portOfUnloading")} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Target of Fumigation</label>
            <input type="text" {...register("targetOfFumigation")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Enclosure Type</label>
            <input type="text" {...register("enclosureType")} className={inputClass} />
          </div>
        </div>
      </fieldset>

      {/* Treatment Schedule */}
      <fieldset className="border border-gray-200 rounded-md p-4 space-y-3">
        <legend className="text-sm font-semibold text-gray-600 px-2">Treatment Schedule (Prescribed)</legend>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Dose Rate (g/m3)</label>
            <input type="number" step="any" {...register("doseRate")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Exposure Period (hours)</label>
            <input type="number" step="any" {...register("exposurePeriod")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Temperature (°C)</label>
            <input type="number" step="any" {...register("scheduleTemperature")} className={inputClass} />
          </div>
        </div>
      </fieldset>

      {/* Fumigation Details */}
      <fieldset className="border border-gray-200 rounded-md p-4 space-y-3">
        <legend className="text-sm font-semibold text-gray-600 px-2">Fumigation Details (Applied)</legend>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Applied Dose (g/m3)</label>
            <input type="number" step="any" {...register("appliedDose")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Exposure (hours)</label>
            <input type="number" step="any" {...register("appliedExposurePeriod")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Temperature (°C)</label>
            <input type="number" step="any" {...register("appliedTemperature")} className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Place of Fumigation (Full Address)</label>
          <textarea rows={2} {...register("placeOfFumigation")} className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Date/Time Commenced</label>
            <input type="datetime-local" defaultValue={formatDateTimeForInput(initialValues?.commencedAt)} {...register("commencedAt")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Date/Time Completed</label>
            <input type="datetime-local" defaultValue={formatDateTimeForInput(initialValues?.completedAt)} {...register("completedAt")} className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Final TLV Reading (ppm)</label>
          <input type="number" step="any" {...register("finalTlvPpm")} className={inputClass} />
        </div>
      </fieldset>

      {/* Signatory */}
      <fieldset className="border border-gray-200 rounded-md p-4 space-y-3">
        <legend className="text-sm font-semibold text-gray-600 px-2">Signatory</legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <input type="text" {...register("fullName")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Accreditation Number</label>
            <input type="text" {...register("accreditationNumber")} className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Signature Date</label>
          <input type="date" defaultValue={formatDateForInput(initialValues?.signatureDate)} {...register("signatureDate")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Signature Image URL</label>
          <input type="url" {...register("signatureUrl")} placeholder="https://..." className={inputClass} />
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:bg-blue-300"
      >
        {isLoading ? "Saving..." : "Save Draft"}
      </button>
    </form>
  );
});

TreatmentForm.displayName = "TreatmentForm";
