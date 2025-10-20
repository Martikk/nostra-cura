import React from "react";
import { motion } from "framer-motion";
import { Section } from "../components/layout/Section";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Navbar } from "../components/layout/Navbar";

export default function HomePage() {
  return (
    <div className="bg-zinc-900 text-zinc-900">
      <Navbar />

      {/* HERO */}
      <Section id="hero" bgImage="/images/hero-tree.jpg" overlay className="pt-28 md:pt-36">
        <div className="flex flex-col items-start gap-6 text-white">
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-extrabold leading-[0.95] tracking-tight md:text-7xl"
          >
            BUILDING BETTER
            <br /> LIVES IN
            <br /> CONSTRUCTION
          </motion.h1>
          <p className="max-w-2xl text-base md:text-lg opacity-95 italic">
            Helping construction professionals thrive, find balance, and enjoy a healthier life.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-amber-400 text-zinc-900">Get Started</Button>
            <Button className="bg-white/10 text-white hover:bg-white/20">Contact</Button>
          </div>
        </div>
      </Section>

      {/* ABOUT */}
      <Section id="about" title="ABOUT US" subtitle="Our Mission" bgImage="/images/about-workers.jpg" overlay>
        <Card className="p-6 md:p-8 max-w-2xl text-zinc-800">
          <p className="text-sm md:text-base leading-relaxed">
            It is our responsibility to help others and leave the world in a better place. We aim to accomplish this by removing the stigma and expanding mental health awareness in the construction industry. Our goal is to help those in it live fulfilling lives. We cannot accomplish this alone. Let’s talk.
          </p>
        </Card>
      </Section>

      {/* SERVICES */}
      <Section id="services" title="OUR SERVICES" subtitle="Consulting" bgImage="/images/services-consult.jpg" overlay>
        <div className="flex flex-col gap-6 md:flex-row">
          {["Strategy & Workshops", "Coaching & 1:1 Support", "Programs for Companies"].map((title, idx) => (
            <Card key={idx} className="flex-1 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-300/90" />
                <div>
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                    We understand the struggles companies face and the pressures people are under. We bring practical strategies that lift teams to their best version.
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* TEAM */}
      <Section id="team" title="OUR TEAM" bgImage="/images/site-crane.jpg" overlay>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <img src="/images/liam.jpg" alt="Liam Dillon" className="h-72 w-full object-cover md:h-auto md:w-1/2" />
              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-semibold">Liam Dillon</h3>
                <p className="text-sm opacity-70">Consultant & Coach</p>
                <p className="mt-4 text-sm leading-relaxed text-zinc-700">
                  Liam brings years of construction leadership with a focus on people-first project delivery, burnout prevention, and high‑performing teams.
                </p>
                <Button className="mt-5 bg-amber-400">Read More</Button>
              </div>
            </div>
          </Card>
          <Card className="p-6 md:p-8 flex items-center justify-center text-center">
            <div>
              <h3 className="text-xl font-semibold">Join the Mission</h3>
              <p className="mt-2 text-sm text-zinc-700">We collaborate with specialists in mental health, operations, and safety.</p>
              <Button className="mt-4 bg-zinc-900 text-white">Work With Us</Button>
            </div>
          </Card>
        </div>
      </Section>

      {/* STORIES */}
      <Section id="stories" title="YOUR STORIES" bgImage="/images/workers-cranes.jpg" overlay>
        <Card className="mx-auto max-w-3xl p-6 md:p-8 text-zinc-800">
          <div className="mb-3 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="h-4 w-4 rounded-full bg-amber-400" />
            ))}
          </div>
          <blockquote className="text-sm leading-relaxed md:text-base">
            “Many professionals in construction face burnout and constant pressure. We step in by helping them set healthier boundaries, balance work and life, and rediscover pride in their craft. Our goal is to remind people they don’t have to carry the weight alone.”
          </blockquote>
        </Card>
      </Section>

      {/* CONTACT */}
      <Section id="contact" title="Get in touch" bgImage="/images/contact-cranes.jpg" overlay>
        <Card className="mx-auto max-w-3xl p-6 md:p-8">
          <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Name</label>
              <input className="rounded-xl border border-zinc-200 px-3 py-2" placeholder="Jane Doe" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Phone</label>
              <input className="rounded-xl border border-zinc-200 px-3 py-2" placeholder="(000) 000‑0000" />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-sm font-medium">Email</label>
              <input className="rounded-xl border border-zinc-200 px-3 py-2" placeholder="you@company.com" />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-sm font-medium">How can we help?</label>
              <textarea className="min-h-[120px] rounded-xl border border-zinc-200 px-3 py-2" placeholder="Tell us your needs" />
            </div>
            <div className="md:col-span-2">
              <Button className="w-full bg-amber-400">Submit</Button>
            </div>
          </form>
        </Card>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-zinc-950 py-10 text-zinc-300">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <p className="text-sm">© {new Date().getFullYear()} Nostra Cura</p>
          <div className="flex items-center gap-4 text-xs">
            <a href="#" className="opacity-80 hover:opacity-100">Privacy</a>
            <a href="#" className="opacity-80 hover:opacity-100">Terms</a>
            <a href="#" className="opacity-80 hover:opacity-100">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}