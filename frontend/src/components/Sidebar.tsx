"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, BriefcaseIcon, FileTextIcon } from "lucide-react";
import { motion } from "framer-motion";

// Navigation items
const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Tenders", href: "/tenders", icon: BriefcaseIcon },
  { name: "Proposals", href: "/proposals", icon: FileTextIcon },
];

interface Company {
  name: string;
  logo_url: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/company/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setCompany(res.data.company))
      .catch((err) => console.error("Sidebar Logo Fetch Failed:", err));
  }, []);

  return (
    <motion.aside
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-64 min-h-screen bg-white border-r shadow-sm flex flex-col p-6 dark:bg-gray-900 dark:border-gray-700"
    >
      {/* Logo Section */}
      <div className="flex flex-col items-center gap-3 mb-6">
        {company?.logo_url ? (
          <Image
            src={company.logo_url}
            alt="Company Logo"
            width={100}
            height={100}
            className="object-contain rounded-lg border bg-white"
          />
        ) : (
          <div className="w-24 h-24 flex items-center justify-center bg-gray-100 border rounded-lg">
            <span className="text-gray-400 text-sm">No Logo</span>
          </div>
        )}

        <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray-100">
          {company?.name || "Company"}
        </h2>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-3 flex-1">
        {navItems.map(({ name, href, icon: Icon }) => (
          <Link
            key={name}
            href={href}
            aria-current={pathname === href ? "page" : undefined}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium ${
              pathname === href
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            <Icon size={20} title={name} />
            {name}
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/auth/login";
          }}
          className="w-full text-left text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition font-medium"
        >
          Logout
        </button>
      </div>
    </motion.aside>
  );
}