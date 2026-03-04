"use client";

import {
  Suspense,
  useState,
  useEffect,
  useCallback,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import emailjs from "@emailjs/browser";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  checkHoneypot,
  checkRateLimit,
  checkTypingDelay,
  validateFields,
  checkLinkSpam,
} from "@/lib/contactValidation";

type Intent = "general" | "instructor" | "institution";

const intentOptions: { value: Intent; label: string }[] = [
  { value: "general", label: "General question" },
  { value: "instructor", label: "Instructor license request" },
  { value: "institution", label: "Institutional license request" },
];

const INSTRUCTOR_TEMPLATE = `Hello,

I am interested in using EpsilonLab for teaching.

Institution:
Course name:
Estimated class size:
Semester dates:
Topics (Laplace / Gaussian / Composition):
Need classroom pack export? (yes/no):
Questions:

Thank you.`;

const INSTITUTION_TEMPLATE = `Hello,

We are interested in an institutional license for EpsilonLab.

Institution/Department:
Number of instructors:
Estimated annual student users:
Preferred start date:
Procurement requirements (if any):
Questions:

Thank you.`;

function templateForIntent(intent: Intent): string {
  if (intent === "instructor") return INSTRUCTOR_TEMPLATE;
  if (intent === "institution") return INSTITUTION_TEMPLATE;
  return "";
}

function parseIntent(raw: string | null): Intent {
  if (raw === "instructor" || raw === "institution") return raw;
  return "general";
}

export default function ContactPage() {
  return (
    <Suspense>
      <ContactForm />
    </Suspense>
  );
}

function ContactForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [intent, setIntent] = useState<Intent>(() =>
    parseIntent(searchParams.get("intent")),
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    institution: "",
    message: templateForIntent(parseIntent(searchParams.get("intent"))),
  });

  /* Extra fields for instructor / institution intents */
  const [courseName, setCourseName] = useState("");
  const [classSize, setClassSize] = useState("");
  const [semesterDates, setSemesterDates] = useState("");

  const [messageDirty, setMessageDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [honeypot, setHoneypot] = useState("");
  const [lastSubmitTime, setLastSubmitTime] = useState<number | null>(null);
  const [formStartTime] = useState(Date.now());

  /* When intent changes, update message template (only if user hasn't typed) */
  const applyTemplate = useCallback(
    (newIntent: Intent) => {
      if (!messageDirty) {
        setFormData((prev) => ({
          ...prev,
          message: templateForIntent(newIntent),
        }));
      }
    },
    [messageDirty],
  );

  /* Keep URL in sync when dropdown changes */
  function handleIntentChange(e: ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as Intent;
    setIntent(next);
    applyTemplate(next);
    const params = new URLSearchParams(searchParams.toString());
    if (next === "general") {
      params.delete("intent");
    } else {
      params.set("intent", next);
    }
    router.replace(`/contact${params.toString() ? `?${params}` : ""}`);
  }

  /* Sync intent from URL on initial load / back-forward navigation */
  useEffect(() => {
    const urlIntent = parseIntent(searchParams.get("intent"));
    if (urlIntent !== intent) {
      setIntent(urlIntent);
      applyTemplate(urlIntent);
    }
    // Only run when searchParams change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    if (name === "message") setMessageDirty(true);
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const showExtraFields = intent === "instructor" || intent === "institution";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    /* --- spam / validation gates --- */
    const now = Date.now();

    const hp = checkHoneypot(honeypot);
    if (!hp.ok) {
      setLoading(false);
      return;
    }

    const rl = checkRateLimit(lastSubmitTime, now);
    if (!rl.ok) {
      alert(rl.reason);
      setLoading(false);
      return;
    }

    const td = checkTypingDelay(formStartTime, now);
    if (!td.ok) {
      setLoading(false);
      return;
    }

    const vf = validateFields(formData);
    if (!vf.ok) {
      alert(vf.reason);
      setLoading(false);
      return;
    }

    const ls = checkLinkSpam(formData.message);
    if (!ls.ok) {
      setLoading(false);
      return;
    }

    /* --- send via EmailJS --- */
    try {
      /* Build full message body including optional fields */
      let fullMessage = formData.message;
      if (showExtraFields) {
        const extras: string[] = [];
        if (courseName) extras.push(`Course name: ${courseName}`);
        if (classSize) extras.push(`Class size: ${classSize}`);
        if (semesterDates) extras.push(`Semester dates: ${semesterDates}`);
        if (extras.length) {
          fullMessage += `\n\n--- Additional info ---\n${extras.join("\n")}`;
        }
      }

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          name: formData.name,
          email: formData.email,
          institution: formData.institution,
          message: fullMessage,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      );

      setStatus("success");
      setLastSubmitTime(Date.now());
      setFormData({ name: "", email: "", institution: "", message: "" });
      setCourseName("");
      setClassSize("");
      setSemesterDates("");
      setMessageDirty(false);
    } catch (error) {
      console.error("EmailJS error:", error);
      setStatus("error");
    }

    setLoading(false);
  }

  const inputClass =
    "w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:border-indigo-500 focus:outline-none";

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-xl mx-auto px-6 py-16 w-full">
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-gray-400 mb-8">
          Interested in a license, have a question, or want to schedule a demo?
          Fill out the form and we&rsquo;ll be in touch.
        </p>

        {status === "success" ? (
          <div className="border border-indigo-500 rounded-lg p-6 bg-indigo-950/30 text-center space-y-2">
            <p className="text-indigo-300 font-semibold">
              Your request was sent.
            </p>
            <p className="text-sm text-gray-400">
              If you do not hear back within 48 hours, email:{" "}
              <a
                href="mailto:contact@epsilonlab.org"
                className="text-indigo-400 underline"
              >
                contact@epsilonlab.org
              </a>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {status === "error" && (
              <div className="border border-red-500 rounded-lg p-4 bg-red-950/30 text-center">
                <p className="text-red-300 text-sm font-semibold">
                  Something went wrong. Please try again later.
                </p>
              </div>
            )}

            {/* Honeypot field – hidden from real users */}
            <input
              type="text"
              name="website"
              autoComplete="off"
              tabIndex={-1}
              aria-hidden="true"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
            />

            {/* Request type dropdown */}
            <div>
              <label
                htmlFor="intent"
                className="block text-sm font-semibold mb-1"
              >
                Request type
              </label>
              <select
                id="intent"
                value={intent}
                onChange={handleIntentChange}
                className={inputClass}
              >
                {intentOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold mb-1"
              >
                Name <span className="text-red-400">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-1"
              >
                Email <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="you@university.edu"
              />
            </div>

            <div>
              <label
                htmlFor="institution"
                className="block text-sm font-semibold mb-1"
              >
                Institution
              </label>
              <input
                id="institution"
                name="institution"
                type="text"
                value={formData.institution}
                onChange={handleChange}
                className={inputClass}
                placeholder="University / Organization"
              />
            </div>

            {/* Conditional fields for instructor / institution */}
            {showExtraFields && (
              <>
                <div>
                  <label
                    htmlFor="courseName"
                    className="block text-sm font-semibold mb-1"
                  >
                    Course name
                  </label>
                  <input
                    id="courseName"
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. CS 6505 — Privacy in Data Science"
                  />
                </div>
                <div>
                  <label
                    htmlFor="classSize"
                    className="block text-sm font-semibold mb-1"
                  >
                    Class size
                  </label>
                  <input
                    id="classSize"
                    type="text"
                    value={classSize}
                    onChange={(e) => setClassSize(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 40"
                  />
                </div>
                <div>
                  <label
                    htmlFor="semesterDates"
                    className="block text-sm font-semibold mb-1"
                  >
                    Semester dates
                  </label>
                  <input
                    id="semesterDates"
                    type="text"
                    value={semesterDates}
                    onChange={(e) => setSemesterDates(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Aug 2026 – Dec 2026"
                  />
                </div>
              </>
            )}

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold mb-1"
              >
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={intent === "general" ? 5 : 12}
                value={formData.message}
                onChange={handleChange}
                className={inputClass}
                placeholder="Tell us about your needs…"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending…" : "Send Message"}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Typical response time: 24–48 hours.
            </p>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
