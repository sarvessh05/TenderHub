"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function EditCompanyPage() {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const company = data.company;
        setName(company.name || "");
        setIndustry(company.industry || "");
        setDescription(company.description || "");
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("Failed to load company details.");
      });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to update your company.");
      return;
    }

    try {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/update`, { 
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, industry, description }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Update failed.");
        return;
      }

      toast.success("Company updated successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-10">
      <form
        onSubmit={handleUpdate}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-10 space-y-8"
      >
        <h1 className="text-3xl font-semibold text-center text-slate-800">
          Edit Company Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name" className="mb-1 block text-sm text-slate-700">
              Company Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="industry" className="mb-1 block text-sm text-slate-700">
              Industry
            </Label>
            <Input
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description" className="mb-1 block text-sm text-slate-700">
            Company Description
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px]"
            required
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full text-sm">
          {loading ? "Updating..." : "Update Company"}
        </Button>
      </form>
    </div>
  );
}
