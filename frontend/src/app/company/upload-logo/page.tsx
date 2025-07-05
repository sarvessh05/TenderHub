"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function UploadLogoPage() {
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!logo) {
      toast.error("Please select a logo to upload.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to upload logo.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("logo", logo);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/company/upload-logo`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Logo upload failed.");
        return;
      }

      toast.success("Logo uploaded successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Upload logo error:", err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-md border-none">
        <CardContent className="p-8 space-y-6">
          <h1 className="text-2xl font-semibold text-center text-slate-800">
            Upload Company Logo
          </h1>

          <form onSubmit={handleUpload} className="space-y-5">
            <div>
              <Label className="block text-sm mb-2 text-slate-700">
                Select Logo File
              </Label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition">
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogo(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
                {logo && (
                  <span className="text-slate-600 text-sm truncate max-w-[200px]">
                    {logo.name}
                  </span>
                )}
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Uploading..." : "Upload Logo"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
