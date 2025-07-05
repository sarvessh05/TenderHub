"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Company {
  name: string;
  industry: string;
  description: string;
  logo_url: string;
}

export default function DashboardPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in.");
      router.push("/auth/login");
      return;
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE}/api/company/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setCompany(res.data.company))
      .catch((err) => {
        console.error("Company fetch error:", err);
        toast.error("Failed to load your company profile.");
      });
  }, [router]);

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-5xl rounded-2xl shadow-md border-none">
        <CardContent className="p-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            {company.logo_url ? (
              <Image
                src={company.logo_url}
                alt={`${company.name} Logo`}
                width={100}
                height={100}
                className="rounded-md object-contain border bg-white"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm border">
                No Logo
              </div>
            )}

            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-slate-800">{company.name}</h1>
              <p className="text-slate-500 text-lg">{company.industry}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-700 leading-relaxed">{company.description}</p>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button
              onClick={() => router.push("/company/edit")}
              className="w-full"
              variant="default"
            >
              Edit Company Profile
            </Button>

            <Button
              onClick={() => router.push("/company/upload-logo")}
              className="w-full"
              variant="secondary"
            >
              Upload Logo
            </Button>

            <Button
              onClick={() => router.push("/tenders")}
              className="w-full"
              variant="default"
            >
              Manage Tenders
            </Button>

            <Button
              onClick={() => router.push("/proposals")}
              className="w-full"
              variant="outline"
            >
              View Proposals
            </Button>

            <Button
              onClick={() => {
                localStorage.clear();
                toast.success("Logged out successfully.");
                router.push("/auth/login");
              }}
              className="w-full"
              variant="destructive"
            >
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
