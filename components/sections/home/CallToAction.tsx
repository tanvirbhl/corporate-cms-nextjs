import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CallToAction() {
  return (
    <section className="bg-slate-900 py-20 mt-12">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to transform your business?
        </h2>
        <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
          Let's discuss how our enterprise architecture solutions can help you achieve your goals.
        </p>
        <Link 
          href="/contact"
          className="inline-flex items-center justify-center px-8 py-4 text-slate-900 bg-white font-semibold rounded-lg hover:bg-slate-50 transition-colors"
        >
          Start a Conversation
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </div>
    </section>
  );
}