"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { email, password } = form;

      await axios.post(
  `${import.meta.env.VITE_API_BASE}/api/auth/signup`,
  { email, password },
  {
    headers: {
      "Content-Type": "application/json",
    },
  }
);

      toast.success("Registration successful!");
      router.push("/auth/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <Card className="w-full max-w-md shadow-md border-none rounded-2xl">
        <CardContent className="p-8 space-y-6">
          <h1 className="text-2xl font-semibold text-center text-slate-800">
            Create an Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name" className="mb-1 block text-sm text-slate-700">
                Name
              </Label>
              <Input
                name="name"
                id="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="email" className="mb-1 block text-sm text-slate-700">
                Email
              </Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="mb-1 block text-sm text-slate-700">
                Password
              </Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-1 text-sm"
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
