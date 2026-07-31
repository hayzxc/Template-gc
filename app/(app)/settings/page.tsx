"use client";

import React, { useEffect, useState } from "react";

export default function SettingsPage() {
  const [logoUrl, setLogoUrl] = useState("");
  const [stampUrl, setStampUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch("/api/company-asset")
      .then((res) => res.json())
      .then((data) => {
        setLogoUrl(data.logoImageUrl || "");
        setStampUrl(data.stampImageUrl || "");
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/company-asset", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stampImageUrl: stampUrl, logoImageUrl: logoUrl }),
      });

      if (!res.ok) throw new Error("Failed to save settings");
      alert("Settings saved successfully");
    } catch (error) {
      console.error(error);
      alert("Error saving settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-2xl font-bold text-gray-900">Company Settings</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
        <div>
          <label className="block font-medium text-gray-700 text-sm">Company Logo Image URL</label>
          <input
            type="url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://..."
            required
            className="mt-1 block w-full rounded-md border-gray-300 p-2 border shadow-sm text-sm"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 text-sm">Company Stamp Image URL</label>
          <input
            type="url"
            value={stampUrl}
            onChange={(e) => setStampUrl(e.target.value)}
            placeholder="https://..."
            required
            className="mt-1 block w-full rounded-md border-gray-300 p-2 border shadow-sm text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:bg-blue-300 text-sm"
        >
          {isLoading ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
