import { jsPDF } from "jspdf";
import type { Preset } from "@/lib/presets/presets";
import { presetToUrl } from "@/lib/presets/presets";

export type ClassroomPackOptions = {
  course?: string;
  instructor?: string;
  presets: Preset[];
  onProgress?: (message: string) => void;
  isCancelled?: () => boolean;
};

const PAGE_W = 210; // A4 mm
const PAGE_H = 297;
const MARGIN = 20;
const CONTENT_W = PAGE_W - MARGIN * 2;

function addFooter(doc: jsPDF, pageNum: number) {
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  doc.text("EpsilonLab Classroom Pack", MARGIN, PAGE_H - 10);
  doc.text(`Page ${pageNum}`, PAGE_W - MARGIN, PAGE_H - 10, {
    align: "right",
  });
}

/** Small async delay to keep UI responsive between heavy operations. */
function tick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 30));
}

/**
 * Generate a multi-page Classroom Pack PDF.
 *
 * Page 1: Cover page
 * Page 2: Key concepts
 * Pages 3+: One per selected preset
 */
export async function generateClassroomPack(
  options: ClassroomPackOptions,
): Promise<Blob> {
  const { course, instructor, presets, onProgress, isCancelled } = options;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let pageNum = 1;

  onProgress?.("Creating cover page…");
  await tick();
  if (isCancelled?.()) throw new Error("Cancelled");

  /* ── Page 1: Cover ─────────────────────────────────────────────── */
  doc.setFillColor(3, 7, 18); // bg-gray-950
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  doc.setFontSize(28);
  doc.setTextColor(129, 140, 248); // indigo-400
  doc.text("EpsilonLab", PAGE_W / 2, 60, { align: "center" });
  doc.setFontSize(16);
  doc.setTextColor(209, 213, 219); // gray-300
  doc.text("Classroom Pack", PAGE_W / 2, 72, { align: "center" });

  let yPos = 95;
  doc.setFontSize(11);
  doc.setTextColor(156, 163, 175); // gray-400
  if (course) {
    doc.text(`Course: ${course}`, PAGE_W / 2, yPos, { align: "center" });
    yPos += 8;
  }
  if (instructor) {
    doc.text(`Instructor: ${instructor}`, PAGE_W / 2, yPos, {
      align: "center",
    });
    yPos += 8;
  }
  doc.text(`Date: ${new Date().toLocaleDateString()}`, PAGE_W / 2, yPos, {
    align: "center",
  });

  yPos += 20;
  doc.setFontSize(10);
  doc.setTextColor(209, 213, 219);
  doc.text("Quick Start Checklist", MARGIN, yPos);
  yPos += 7;
  const checklist = [
    "Open each preset link in a browser tab",
    "Set a seed for reproducible demos",
    "Walk through demos in order during lecture",
    "Share preset URLs with students after class",
  ];
  doc.setFontSize(9);
  doc.setTextColor(156, 163, 175);
  for (const item of checklist) {
    doc.text(`\u2610  ${item}`, MARGIN + 4, yPos);
    yPos += 6;
  }

  yPos += 10;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 120);
  doc.text("Demo Agenda", MARGIN, yPos);
  yPos += 6;
  const agendaPresets = presets.slice(0, 3);
  for (let i = 0; i < agendaPresets.length; i++) {
    doc.text(`${i + 1}. ${agendaPresets[i].title}`, MARGIN + 4, yPos);
    yPos += 5;
  }

  addFooter(doc, pageNum);

  /* ── Page 2: Key Concepts ──────────────────────────────────────── */
  doc.addPage();
  pageNum++;
  onProgress?.("Creating key concepts page…");
  await tick();
  if (isCancelled?.()) throw new Error("Cancelled");

  doc.setFillColor(3, 7, 18);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  doc.setFontSize(16);
  doc.setTextColor(129, 140, 248);
  doc.text("Key Concepts", MARGIN, 30);

  doc.setFontSize(10);
  doc.setTextColor(209, 213, 219);
  yPos = 42;

  const concepts: [string, string][] = [
    [
      "Privacy Budget (\u03B5)",
      "Controls the privacy-utility tradeoff. Smaller \u03B5 = stronger privacy, more noise.",
    ],
    [
      "Failure Probability (\u03B4)",
      "Gaussian mechanism allows a small probability \u03B4 of exceeding the \u03B5 guarantee.",
    ],
    [
      "Sensitivity (\u0394f)",
      "Max change in query output when one record differs. Drives noise calibration.",
    ],
    [
      "Laplace Mechanism",
      "Adds noise ~ Lap(\u0394f/\u03B5). Pure \u03B5-DP. Scale b = \u0394f/\u03B5.",
    ],
    [
      "Gaussian Mechanism",
      "Adds noise ~ N(0, \u03C3\u00B2). (\u03B5, \u03B4)-DP. \u03C3 \u2248 \u0394f \u00B7 \u221A(2 ln(1.25/\u03B4)) / \u03B5.",
    ],
  ];

  for (const [term, desc] of concepts) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(165, 180, 252); // indigo-300
    doc.text(term, MARGIN, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(156, 163, 175);
    const lines = doc.splitTextToSize(desc, CONTENT_W - 4);
    doc.text(lines, MARGIN + 4, yPos);
    yPos += lines.length * 5 + 4;
  }

  // Scale formulas
  yPos += 6;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(165, 180, 252);
  doc.text("Scale Formulas", MARGIN, yPos);
  yPos += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(156, 163, 175);
  doc.setFontSize(9);
  doc.text("Laplace scale:  b = \u0394f / \u03B5", MARGIN + 4, yPos);
  yPos += 5;
  doc.text(
    "Gaussian sigma:  \u03C3 \u2248 \u0394f \u00B7 \u221A(2 ln(1.25/\u03B4)) / \u03B5",
    MARGIN + 4,
    yPos,
  );

  addFooter(doc, pageNum);

  /* ── Pages 3+: Preset pages ────────────────────────────────────── */
  for (let i = 0; i < presets.length; i++) {
    if (isCancelled?.()) throw new Error("Cancelled");
    const preset = presets[i];
    onProgress?.(`Creating preset page ${i + 1}/${presets.length}: ${preset.title}…`);
    await tick();

    doc.addPage();
    pageNum++;

    doc.setFillColor(3, 7, 18);
    doc.rect(0, 0, PAGE_W, PAGE_H, "F");

    // Title
    doc.setFontSize(14);
    doc.setTextColor(129, 140, 248);
    doc.text(preset.title, MARGIN, 30);

    // Learning goal
    doc.setFontSize(9);
    doc.setTextColor(156, 163, 175);
    yPos = 38;
    doc.setFont("helvetica", "bold");
    doc.text("Learning Goal:", MARGIN, yPos);
    doc.setFont("helvetica", "normal");
    const goalLines = doc.splitTextToSize(preset.learningGoal, CONTENT_W - 25);
    doc.text(goalLines, MARGIN + 25, yPos);
    yPos += goalLines.length * 4 + 8;

    // Parameter table
    doc.setFont("helvetica", "bold");
    doc.setTextColor(165, 180, 252);
    doc.text("Parameters", MARGIN, yPos);
    yPos += 6;

    const state = preset.state;
    const params: [string, string][] = [
      ["Dataset", state.datasetId],
      ["Query", state.queryType],
      ["Mechanism", state.mechanism],
      ["\u03B5 (epsilon)", String(state.epsilon)],
      ["\u0394f (sensitivity)", String(state.sensitivity)],
      ["Runs", String(state.runs)],
    ];
    if (state.mechanism === "gaussian" && state.delta != null) {
      params.push(["\u03B4 (delta)", String(state.delta)]);
    }
    if (state.seed) {
      params.push(["Seed", state.seed]);
    }
    params.push(["Topic", state.topic]);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    for (const [key, val] of params) {
      doc.setTextColor(156, 163, 175);
      doc.text(`${key}:`, MARGIN + 4, yPos);
      doc.setTextColor(209, 213, 219);
      doc.text(val, MARGIN + 40, yPos);
      yPos += 5;
    }

    // Share URL
    yPos += 6;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(165, 180, 252);
    doc.text("Share URL", MARGIN, yPos);
    yPos += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(129, 140, 248);
    const shareUrl = presetToUrl(preset);
    const urlLines = doc.splitTextToSize(shareUrl, CONTENT_W);
    doc.text(urlLines, MARGIN + 4, yPos);

    addFooter(doc, pageNum);
  }

  onProgress?.("Finalizing PDF…");
  await tick();

  return doc.output("blob");
}
