// src/components/Features.tsx
import { BriefcaseIcon, ClipboardDocumentListIcon, BoltIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: "Seamless Tender Discovery",
    description: "Browse and filter tenders by industry, location, or budget — all in one place.",
    icon: ClipboardDocumentListIcon,
  },
  {
    name: "Smart Proposal Management",
    description: "Track submissions, view status, and update proposals through an intuitive dashboard.",
    icon: BriefcaseIcon,
  },
  {
    name: "Lightning Fast Performance",
    description: "Built with Next.js, your experience is blazing fast, always.",
    icon: BoltIcon,
  },
];

export default function Features() {
  return (
    <section className="bg-white py-20 px-6 sm:px-10">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-6">
          Why Choose TenderHub?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-14">
          Our platform is built to empower B2B companies in navigating the tender world with clarity, speed, and confidence.
        </p>
        <div className="grid sm:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl shadow hover:shadow-md transition"
            >
              <feature.icon className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-medium text-gray-800 mb-2">{feature.name}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}