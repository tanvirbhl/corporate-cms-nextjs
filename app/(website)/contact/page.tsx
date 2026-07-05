import { Mail, Phone, MapPin } from "lucide-react";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { FadeInView } from "@/components/common/FadeInView";

export const metadata = {
  title: "Contact Us | Skyland",
  description: "Get in touch with our team to discuss your next enterprise project.",
};

export default function ContactPage() {
  return (
    // 1. Increased top padding to match the homepage hero spacing
    <main className="flex flex-col min-h-screen pt-36 pb-20">
      
      {/* 2. CHANGED: Replaced "container" with the exact same wrapper used in Navbar.tsx */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <FadeInView>
          <div className="max-w-3xl mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6">
              Let's build something extraordinary.
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Whether you need custom software, cloud infrastructure, or enterprise architecture, our team of experts is ready to help you scale.
            </p>
          </div>
        </FadeInView>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Left Column: Contact Information */}
          <div>
            <FadeInView delay={0.1}>
              <div className="space-y-10">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-8">Contact Information</h3>
                  <div className="space-y-8">
                    
                    {/* Email Block */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mr-5 shadow-sm border border-blue-100">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">Email Us</p>
                        <a href="mailto:hello@skyland.com" className="text-slate-600 hover:text-blue-600 transition-colors text-lg">
                          hello@skyland.com
                        </a>
                      </div>
                    </div>

                    {/* Phone Block */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mr-5 shadow-sm border border-blue-100">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">Call Us</p>
                        <a href="tel:+1234567890" className="text-slate-600 hover:text-blue-600 transition-colors text-lg">
                          +1 (234) 567-890
                        </a>
                      </div>
                    </div>

                    {/* Address Block */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mr-5 shadow-sm border border-blue-100">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">Visit Us</p>
                        <p className="text-slate-600 leading-relaxed text-lg">
                          123 Innovation Drive<br />
                          Tech District, NY 10001
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Office Hours Card */}
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2">Office Hours</h4>
                  <p className="text-slate-600">
                    Monday - Friday<br />
                    9:00 AM - 6:00 PM (EST)
                  </p>
                </div>
              </div>
            </FadeInView>
          </div>

          {/* Right Column: The Form Component */}
          <div className="lg:-mt-6">
            <ContactForm />
          </div>

        </div>
      </div>
    </main>
  );
}