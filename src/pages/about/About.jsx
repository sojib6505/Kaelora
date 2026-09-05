import React from "react";
import { Link } from "react-router";
import { ArrowRight, Heart, Sparkles, ShieldCheck, Gem } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#24211f]">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:px-10 lg:px-16 lg:py-28">
          
          {/* Text */}
          <div className="max-w-xl">
            <p className="mb-5 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.25em] text-[#9a7564]">
              <span className="h-px w-10 bg-[#9a7564]"></span>
              AK Signature Wear
            </p>

            <h1 className="text-5xl font-light leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              A Mark
              <br />
              <span className="font-serif italic text-[#9a7564]">
                of Style.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-gray-600 md:text-lg">
              Where timeless elegance meets your individual style. AK Signature
              Wear is dedicated to bringing beautiful ladies' attire that makes
              every woman feel confident, comfortable and effortlessly stylish.
            </p>

            <div className="mt-9">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-3 rounded-full bg-[#24211f] px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-[#9a7564]"
              >
                Explore Collection
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#eee4df] blur-2xl"></div>

            <div className="relative overflow-hidden rounded-[2rem]">
              <img
                src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85"
                alt="AK Signature Wear Fashion"
                className="h-[520px] w-full object-cover transition duration-700 hover:scale-105 sm:h-[600px]"
              />

              <div className="absolute bottom-6 left-6 rounded-2xl bg-white/90 px-5 py-4 backdrop-blur-md">
                <p className="font-serif text-lg italic">
                  Elegance in every detail.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTRO ================= */}
      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
          <Sparkles className="mx-auto mb-6 text-[#9a7564]" size={25} />

          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#9a7564]">
            Our Story
          </p>

          <h2 className="font-serif text-4xl leading-tight md:text-5xl">
            Fashion is not just what you wear,
            <br />
            <span className="italic text-[#9a7564]">
              it is how you express yourself.
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-gray-600">
            At AK Signature Wear, we believe that every woman has her own
            unique sense of beauty and style. Our goal is to make that
            individuality shine through thoughtfully selected ladies' attire
            that blends elegance, quality and modern fashion.
          </p>
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-16 lg:py-28">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#9a7564]">
            Why AK Signature Wear
          </p>

          <h2 className="font-serif text-4xl md:text-5xl">
            Made with care.
            <br />
            <span className="italic text-[#9a7564]">Chosen for you.</span>
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {/* Card 1 */}
          <div className="group rounded-[1.5rem] border border-black/5 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5">
            <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-full bg-[#f1e8e3] text-[#9a7564]">
              <Heart size={21} />
            </div>

            <h3 className="font-serif text-2xl">Care</h3>

            <p className="mt-4 text-sm leading-7 text-gray-600">
              We do our best to serve every customer with genuine care and
              attention, because your experience matters to us.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group rounded-[1.5rem] border border-black/5 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5">
            <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-full bg-[#f1e8e3] text-[#9a7564]">
              <ShieldCheck size={21} />
            </div>

            <h3 className="font-serif text-2xl">Quality</h3>

            <p className="mt-4 text-sm leading-7 text-gray-600">
              From selection to presentation, we focus on quality and details
              that help you choose pieces you will love to wear.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group rounded-[1.5rem] border border-black/5 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5">
            <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-full bg-[#f1e8e3] text-[#9a7564]">
              <Gem size={21} />
            </div>

            <h3 className="font-serif text-2xl">Your Style</h3>

            <p className="mt-4 text-sm leading-7 text-gray-600">
              Every woman has an individual taste. We aim to offer styles that
              let you express your personality in your own beautiful way.
            </p>
          </div>
        </div>
      </section>

      {/* ================= STATEMENT ================= */}
      <section className="relative overflow-hidden bg-[#292522]">
        <div className="absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#9a7564]/20 blur-3xl"></div>

        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center md:py-32">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#c9a99a]">
            AK Signature Wear
          </p>

          <h2 className="mt-6 font-serif text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
            Your style.
            <br />
            <span className="italic text-[#c9a99a]">
              Your signature.
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-white/60 md:text-base">
            Discover ladies' attire selected with care, quality and attention
            to the details that make your style uniquely yours.
          </p>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section className="bg-[#faf9f7]">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9a7564]">
            Let's Connect
          </p>

          <h2 className="mt-4 font-serif text-4xl md:text-5xl">
            We'd love to hear from you.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-600">
            Have a question about our collection or need help choosing your
            style? Feel free to reach out to us on WhatsApp.
          </p>

          <a
            href="https://wa.me/8801621234852"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#24211f] px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-[#9a7564]"
          >
            WhatsApp
            <ArrowRight size={17} />
          </a>

          <p className="mt-4 text-sm text-gray-500">
            +88 01621234852
          </p>
        </div>
      </section>

      {/* ================= FOOTER BRAND ================= */}
      <section className="border-t border-black/5 bg-white py-10 text-center">
        <h3 className="font-serif text-2xl tracking-wide">
          AK Signature Wear
        </h3>

        <p className="mt-2 text-xs uppercase tracking-[0.25em] text-[#9a7564]">
          A Mark of Style
        </p>
      </section>
    </div>
  );
};

export default About;