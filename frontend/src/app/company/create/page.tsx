"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function CreateCompanyPage() {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !industry || !description || !logo) {
      toast.error("All fields are required.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in.");
      return;
    }

    try {
      setLoading(true);

      const createRes = await fetch("http://localhost:5000/api/company/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, industry, description }),
      });

      const createData = await createRes.json();

      if (!createRes.ok) {
        toast.error(createData.message || "Company creation failed.");
        return;
      }

      const logoForm = new FormData();
      logoForm.append("logo", logo);

      const uploadRes = await fetch("http://localhost:5000/api/company/upload-logo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: logoForm,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        toast.error(uploadData.message || "Logo upload failed.");
        return;
      }

      toast.success("Company created successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Create company error:", err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-10 space-y-8"
      >
        <h1 className="text-3xl font-semibold text-center text-slate-800">
          Create Your Company
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
              placeholder="e.g., Stark Industries."
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
              placeholder="e.g., AgriTech"
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
            placeholder="What does your company do?"
            className="min-h-[100px]"
            required
          />
        </div>

        <div>
          <Label htmlFor="logo" className="mb-2 block text-sm text-slate-700">
            Upload Company Logo
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

        <Button
          type="submit"
          disabled={loading}
          className="w-full text-sm mt-4"
        >
          {loading ? "Creating Company..." : "Create Company"}
        </Button>
      </form>
    </div>
  );
}