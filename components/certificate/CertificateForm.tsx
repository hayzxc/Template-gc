"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { certificateSchema, CertificateInput } from "@/lib/certificate-schema";
import { CERTIFICATE_CONSTANTS } from "@/lib/certificate-constants";

interface CertificateFormProps {
  initialValues?: Partial<CertificateInput>;
  onSubmit: (data: CertificateInput) => Promise<void>;
  onChange?: (data: Partial<CertificateInput>) => void;
  isLoading?: boolean;
}

export const CertificateForm: React.FC<CertificateFormProps> = ({
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
  } = useForm({
    resolver: zodResolver(certificateSchema),
    defaultValues: initialValues || {
      certificateDate: undefined,
      commodity: "",
      containerNumber: "",
      carrierVessel: "",
      fumigationArea: "",
      commencingAt: undefined,
      completedAt: undefined,
      gasLevelPpm: undefined,
      fumigatorName: "",
      fumigatorSignatureUrl: "",
    },
  });

  React.useEffect(() => {
    if (onChange) {
      const subscription = watch((value) => {
        onChange(value as Partial<CertificateInput>);
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, onChange]);

  const formatDateForInput = (d?: Date | string | null) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  const formatDateTimeForInput = (d?: Date | string | null) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 16);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl text-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium text-gray-700">Nomor Registrasi / Registration No.</label>
          <input
            type="text"
            readOnly
            value={CERTIFICATE_CONSTANTS.registrationNumber}
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2 shadow-sm border text-gray-600"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Fumigan / Fumigant</label>
          <input
            type="text"
            readOnly
            value={CERTIFICATE_CONSTANTS.fumigant}
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2 shadow-sm border text-gray-600"
          />
        </div>
      </div>

      <div>
        <label className="block font-medium text-gray-700">Tanggal / Date</label>
        <input
          type="date"
          defaultValue={formatDateForInput(initialValues?.certificateDate)}
          {...register("certificateDate")}
          className="mt-1 block w-full rounded-md border-gray-300 p-2 border shadow-sm"
        />
        {errors.certificateDate && <p className="text-red-500 text-xs mt-1">{errors.certificateDate.message}</p>}
      </div>

      <div>
        <label className="block font-medium text-gray-700">Nama Komoditas / Commodity/Article *</label>
        <textarea
          rows={5}
          {...register("commodity")}
          className="mt-1 block w-full rounded-md border-gray-300 p-2 border shadow-sm"
        />
        {errors.commodity && <p className="text-red-500 text-xs mt-1">{errors.commodity.message}</p>}
      </div>

      <div>
        <label className="block font-medium text-gray-700">Nomor Peti Kemas / Container Number *</label>
        <textarea
          rows={2}
          {...register("containerNumber")}
          className="mt-1 block w-full rounded-md border-gray-300 p-2 border shadow-sm"
        />
        {errors.containerNumber && <p className="text-red-500 text-xs mt-1">{errors.containerNumber.message}</p>}
      </div>

      <div>
        <label className="block font-medium text-gray-700">Alat Angkut / Carrier/Vessel *</label>
        <textarea
          rows={2}
          {...register("carrierVessel")}
          className="mt-1 block w-full rounded-md border-gray-300 p-2 border shadow-sm"
        />
        {errors.carrierVessel && <p className="text-red-500 text-xs mt-1">{errors.carrierVessel.message}</p>}
      </div>

      <div>
        <label className="block font-medium text-gray-700">Area/Lokasi Fumigasi / Area/Location *</label>
        <textarea
          rows={2}
          {...register("fumigationArea")}
          className="mt-1 block w-full rounded-md border-gray-300 p-2 border shadow-sm"
        />
        {errors.fumigationArea && <p className="text-red-500 text-xs mt-1">{errors.fumigationArea.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium text-gray-700">Waktu Dimulai / Commencing At</label>
          <input
            type="datetime-local"
            defaultValue={formatDateTimeForInput(initialValues?.commencingAt)}
            {...register("commencingAt")}
            className="mt-1 block w-full rounded-md border-gray-300 p-2 border shadow-sm"
          />
          {errors.commencingAt && <p className="text-red-500 text-xs mt-1">{errors.commencingAt.message}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-700">Waktu Selesai / Completed At</label>
          <input
            type="datetime-local"
            defaultValue={formatDateTimeForInput(initialValues?.completedAt)}
            {...register("completedAt")}
            className="mt-1 block w-full rounded-md border-gray-300 p-2 border shadow-sm"
          />
          {errors.completedAt && <p className="text-red-500 text-xs mt-1">{errors.completedAt.message}</p>}
        </div>
      </div>

      <div>
        <label className="block font-medium text-gray-700">Konsentrasi Gas (ppm) / Gas Levels</label>
        <input
          type="number"
          step="any"
          {...register("gasLevelPpm")}
          className="mt-1 block w-full rounded-md border-gray-300 p-2 border shadow-sm"
        />
        {errors.gasLevelPpm && <p className="text-red-500 text-xs mt-1">{errors.gasLevelPpm.message}</p>}
      </div>

      <div>
        <label className="block font-medium text-gray-700">Nama Fumigator / Fumigator Name *</label>
        <input
          type="text"
          {...register("fumigatorName")}
          className="mt-1 block w-full rounded-md border-gray-300 p-2 border shadow-sm"
        />
        {errors.fumigatorName && <p className="text-red-500 text-xs mt-1">{errors.fumigatorName.message}</p>}
      </div>

      <div>
        <label className="block font-medium text-gray-700">URL Tanda Tangan / Signature Image URL</label>
        <input
          type="url"
          {...register("fumigatorSignatureUrl")}
          placeholder="https://..."
          className="mt-1 block w-full rounded-md border-gray-300 p-2 border shadow-sm"
        />
        {errors.fumigatorSignatureUrl && <p className="text-red-500 text-xs mt-1">{errors.fumigatorSignatureUrl.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:bg-blue-300"
      >
        {isLoading ? "Saving..." : "Save Draft"}
      </button>
    </form>
  );
};
