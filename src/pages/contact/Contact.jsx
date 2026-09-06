import { MapPin, Phone, Mail, MessageCircle, ArrowRight } from "lucide-react";
import ScrollToTop from "../../components/scrollToTop/ScrollToTop";

export default function Contact() {
  return (
    <>
      <ScrollToTop />
      <main className="bg-white text-gray-900">
        {/* Hero */}
        <section className="pt-20 pb-14 sm:pt-24 sm:pb-20 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.3em] text-amber-600 uppercase mb-4">
              Get In Touch
            </p>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight">
              Contact Us
            </h1>

            <div className="flex items-center justify-center gap-2 mt-5">
              <div className="h-px w-12 bg-amber-300" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <div className="h-px w-12 bg-amber-300" />
            </div>

            <p className="max-w-2xl mx-auto mt-6 text-sm sm:text-base text-gray-500 leading-7">
              Have a question about our products, orders or delivery? We'd love
              to hear from you. Reach out to us and our team will be happy to
              assist you.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-14 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
              {/* Left Side */}
              <div>
                <p className="text-xs font-semibold tracking-[0.25em] text-amber-600 uppercase mb-3">
                  We'd Love To Hear From You
                </p>

                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-tight">
                  Let’s talk about
                  <br />
                  <span className="italic">your style.</span>
                </h2>

                <p className="mt-6 text-gray-500 leading-7 max-w-lg">
                  Whether you need help choosing the perfect outfit, have a
                  question about an order, or simply want to know more about AK
                  Signature Wear, feel free to contact us.
                </p>
              </div>

              {/* Right Side */}
              <div className="bg-gray-50 p-6 sm:p-8 md:p-10 rounded-2xl">
                <p className="text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase mb-2">
                  Contact Information
                </p>

                <h2 className="font-serif text-2xl sm:text-3xl mb-8">
                  We're here to help.
                </h2>

                <div className="space-y-6">
                  {/* Phone */}
                  <a
                    href="tel:+8801621234852"
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0 group-hover:bg-gray-900 group-hover:text-white transition">
                      <Phone size={18} />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400">
                        Phone
                      </p>

                      <p className="mt-1 text-sm sm:text-base font-medium group-hover:text-amber-600 transition">
                        +88 01621-234852
                      </p>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/8801621234852"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0 group-hover:bg-gray-900 group-hover:text-white transition">
                      <MessageCircle size={18} />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400">
                        WhatsApp
                      </p>

                      <p className="mt-1 text-sm sm:text-base font-medium group-hover:text-amber-600 transition">
                        Chat with us on WhatsApp
                      </p>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:your-email@example.com"
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0 group-hover:bg-gray-900 group-hover:text-white transition">
                      <Mail size={18} />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400">
                        Email
                      </p>

                      <p className="mt-1 text-sm sm:text-base font-medium group-hover:text-amber-600 transition">
                        Email us
                      </p>
                    </div>
                  </a>

                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0">
                      <MapPin size={18} />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400">
                        Location
                      </p>

                      <p className="mt-1 text-sm sm:text-base font-medium">
                        Dhaka, Bangladesh
                      </p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <a
                  href="https://wa.me/8801621234852"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 mt-10 bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-amber-600 transition-all duration-300 group"
                >
                  Chat on WhatsApp
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Statement */}
        <section className="border-t border-gray-100 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-xs font-semibold tracking-[0.25em] text-amber-600 uppercase mb-4">
              AK Signature Wear
            </p>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-tight">
              A Mark of Style
            </h2>

            <p className="mt-5 text-sm sm:text-base text-gray-500 leading-7">
              We do our best to serve each customer with care, quality and
              attention to their individual taste.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
