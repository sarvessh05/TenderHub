'use client';
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 sm:px-10 bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-800 leading-tight max-w-2xl"
      >
        Powering India’s B2B Tender Future
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-4 text-gray-600 text-base sm:text-lg max-w-xl"
      >
        Discover tenders. Submit proposals. Grow your business — all from one dashboard.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-6 flex flex-wrap gap-4 justify-center"
      >
        <Link
          href="/tenders"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 transition"
        >
          📄 View Tenders
        </Link>

        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-full hover:bg-blue-50 transition"
        >
          🔐 Login
        </Link>

        <Link
          href="/auth/register"
          className="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-900 transition"
        >
          📝 Register
        </Link>
      </motion.div>
    </section>
  );
}