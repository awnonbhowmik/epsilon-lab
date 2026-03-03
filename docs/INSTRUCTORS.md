# EpsilonLab — Instructor Guide

This guide covers everything you need to use EpsilonLab in a classroom setting.

## Demo Presets

EpsilonLab ships with 13 curated presets organized into three categories:

### Laplace Mechanism
- **High Privacy (ε = 0.2)** — see how small ε produces wide noise
- **Balanced (ε = 1)** — the typical real-world default
- **Low Privacy (ε = 5)** — nearly no noise, weak guarantee
- **Sensitivity Matters** — compare Sum vs Mean to see Δf impact
- **Skewed Data Noise Impact** — outlier-driven sensitivity effects

### Gaussian Mechanism
- **Baseline (ε = 1, δ = 1e-5)** — standard (ε, δ)-DP configuration
- **Smaller δ (1e-7)** — smaller δ requires larger σ
- **Gaussian vs Laplace** — compare noise PDF shapes at same ε
- **Mean Query** — low-sensitivity query with tight noise
- **Count Query** — Δf = 1, the simplest possible sensitivity

### Composition
- **k = 5, ε = 0.5 each** — basic sequential composition
- **k = 10, ε = 0.2 each** — many small-ε queries
- **Gaussian Composition** — (ε_i, δ_i) accumulation

### How to use presets

1. Visit `/for-instructors` to see the full preset library
2. Click **Open** to launch the simulator with that preset's configuration
3. Click **Copy link** to get a shareable URL for students
4. In the simulator, click **📚 Presets** in the header to browse presets inline

Each preset URL encodes the full simulator state — students see exactly
the same configuration when they open the link.

## Embedding in Your LMS

EpsilonLab supports an embed-friendly mode with minimal UI chrome.

### Embed URL format

Use the `/embed` route with standard URL parameters:

```
/embed?d=small_integers&q=sum&e=1&s=15&r=500&mech=laplace&topic=single
```

Alternatively, add `embed=1` to any simulator URL:

```
/simulator?embed=1&d=small_integers&q=sum&e=1&s=15&r=500&mech=laplace&topic=single
```

### iframe snippet

```html
<iframe
  src="https://YOUR_DOMAIN/embed?d=small_integers&q=sum&e=1&s=15&r=500&mech=laplace&topic=single"
  width="100%"
  height="800"
  frameborder="0"
  allow="clipboard-write"
  style="border:none; border-radius:8px;"
></iframe>
```

Replace `YOUR_DOMAIN` with your EpsilonLab deployment URL.

### Canvas

Edit a page → switch to HTML editor → paste the iframe snippet.

### Blackboard

Content → Build Content → Web Link or HTML fragment → paste the iframe.

### Moodle

Edit a Label or Page resource → toggle HTML source → paste the iframe.

### What embed mode hides

- Top navigation header
- Mode banner
- Export PNG/PDF buttons
- References panel

Controls, results, and charts remain visible and interactive.

## Generating a Classroom Pack

The Classroom Pack generates a single multi-page PDF suitable as a
lecture handout:

1. Visit `/classroom-pack`
2. Optionally fill in **Course Name** and **Instructor Name**
3. Select 3–6 presets from the list
4. Click **Generate PDF**
5. Click **Download PDF** when ready

### PDF contents

- **Page 1 (Cover):** Title, course/instructor info, date, quick-start
  checklist, demo agenda with your first 3 selected presets
- **Page 2 (Key Concepts):** Definitions of ε, δ, sensitivity, Laplace,
  Gaussian mechanisms, and scale formulas
- **Pages 3+ (Presets):** One page per selected preset with title,
  learning goal, parameter table, and share URL

### Tips

- Generation happens entirely in the browser — no data is sent to any server
- A progress indicator shows which preset is being processed
- You can cancel generation at any time
- The PDF uses A4 format

## Reproducibility

### Using seeds

Set the **Seed** field in the simulator to a fixed integer (e.g. 42) for
deterministic results:

- All students see the same noisy values with the same seed
- Share URLs include the seed automatically
- Useful for homework assignments and grading

### Preset URLs include seeds

Most presets include `seed=42` by default. You can change the seed in the
simulator and copy a new link.

## Class Session Checklist

The `/for-instructors` page includes an interactive checklist:

**Before class:**
- Verify projector resolution (1280×720 min recommended)
- Open preset links in browser tabs
- Confirm seed value for reproducibility
- Test that WASM loads correctly

**During class:**
- Demo 1: Laplace mechanism — high vs low ε
- Demo 2: Gaussian mechanism — δ effect on σ
- Demo 3: Composition — k sequential queries

**After class:**
- Assign exercises from the lesson plan
- Share preset links with students
- Collect feedback

Click **Copy checklist** to get a plain-text version for your notes.

## Accessibility Notes

- **Font sizes:** All text uses relative sizing (rem/em). Browser zoom
  works correctly up to 200%.
- **Contrast:** The dark theme meets WCAG AA contrast ratios for body
  text (gray-300 on gray-950).
- **Keyboard navigation:** All interactive elements (buttons, sliders,
  toggles) are keyboard-accessible.
- **Screen readers:** Charts use ARIA labels. The mode toggle uses
  `role="switch"` with `aria-checked`.
- **Projector friendliness:** The dark background and high-contrast
  indigo accent work well on projectors. Consider increasing browser
  zoom to 125–150% for large lecture halls.
