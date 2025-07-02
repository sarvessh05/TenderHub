// src/components/CallToAction.tsx
export default function CallToAction() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 px-6 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ready to get started?
        </h2>
        <p className="text-lg sm:text-xl mb-8">
          Join TenderHub and start managing your tender opportunities with confidence and clarity.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href="/auth/register"
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition"
          >
            Register Now
          </a>
          <a
            href="/tenders"
            className="bg-transparent border border-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-blue-600 transition"
          >
            Browse Tenders
          </a>
        </div>
      </div>
    </section>
  );
}