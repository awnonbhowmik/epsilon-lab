"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const institution = (form.elements.namedItem("institution") as HTMLInputElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;

    const subject = encodeURIComponent(`EpsilonLab Inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nInstitution: ${institution}\n\n${message}`
    );

    window.location.href = `mailto:contact@example.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-indigo-400">ε</span>
          <span className="text-xl font-bold text-gray-100">EpsilonLab</span>
        </Link>
        <div className="flex gap-4 text-sm text-gray-400">
          <Link href="/simulator" className="hover:text-indigo-300">Simulator</Link>
          <Link href="/pricing" className="hover:text-indigo-300">Pricing</Link>
          <Link href="/contact" className="text-indigo-300">Contact</Link>
        </div>
      </nav>

      <main className="flex-1 max-w-xl mx-auto px-6 py-16 w-full">
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-gray-400 mb-8">
          Interested in a license, have a question, or want to schedule a demo?
          Fill out the form and we will be in touch.
        </p>

        {submitted ? (
          <div className="border border-indigo-500 rounded-lg p-6 bg-indigo-950/30 text-center">
            <p className="text-indigo-300 font-semibold mb-1">
              Thank you for reaching out!
            </p>
            <p className="text-sm text-gray-400">
              Your email client should have opened with a pre-filled message. If
              not, please email us directly at{" "}
              <span className="text-indigo-400">contact@example.com</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-1">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:border-indigo-500 focus:outline-none"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-1">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:border-indigo-500 focus:outline-none"
                placeholder="you@university.edu"
              />
            </div>

            <div>
              <label htmlFor="institution" className="block text-sm font-semibold mb-1">
                Institution
              </label>
              <input
                id="institution"
                name="institution"
                type="text"
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:border-indigo-500 focus:outline-none"
                placeholder="University / Organization"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold mb-1">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:border-indigo-500 focus:outline-none"
                placeholder="Tell us about your needs…"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors"
            >
              Send Message
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
