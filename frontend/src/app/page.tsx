// src/app/page.tsx
import Hero from "../components/hero";
import Features from "../components/features";
import CallToAction from "../components/CTA";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Hero />
      <Features />
      <CallToAction />
    </main>
  );
}