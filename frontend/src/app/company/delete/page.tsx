"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DeleteCompanyPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete your company?");
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/company/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to delete company.");
        return;
      }

      toast.success("Company deleted successfully.");
      router.push("/company/create");
    } catch (err) {
      console.error("Delete Company Error:", err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-md border-none">
        <CardContent className="p-8 space-y-6 text-center">
          <h1 className="text-2xl font-semibold text-red-600">⚠️ Danger Zone</h1>
          <p className="text-slate-700 text-sm">
            This action is irreversible and will permanently delete your company profile.
          </p>
          <Button
            onClick={handleDelete}
            disabled={loading}
            variant="destructive"
            className="w-full"
          >
            {loading ? "Deleting..." : "Delete Company"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
