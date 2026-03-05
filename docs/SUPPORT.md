# EpsilonLab — Support & Bug Reports

## Reporting a Bug

1. Press **Shift + D** in the browser to open the diagnostics panel.
2. Click **Copy Diagnostics** to copy version, environment, route, and
   simulator state to your clipboard.
3. Open an issue at
   <https://github.com/awnonbhowmik/epsilon-lab/issues/new> and paste
   the diagnostics output along with a description of what happened.

Include:
- Steps to reproduce the issue
- Expected vs actual behaviour
- The diagnostics text (version, browser, route, parameters)

## Known Issues

- **WASM may fail on very old browsers.** WebAssembly requires a modern
  browser (Chrome 57+, Firefox 52+, Safari 11+, Edge 16+). If WASM
  fails to load, the `/health` page will show a FAIL status.
- **Export PNG may timeout on very large chart dimensions.** The exporter
  clamps to 4 096 px and retries once automatically. If it still fails,
  try reducing the number of runs or the browser zoom level.
- **Clipboard copy may not work in insecure (non-HTTPS) contexts.**
  Share links and diagnostics copy buttons require a secure origin.

## Browser Support

| Browser          | Minimum Version |
|------------------|-----------------|
| Chrome / Edge    | 57+             |
| Firefox          | 52+             |
| Safari           | 11+             |
| Safari iOS       | 11.3+           |
| Samsung Internet | 7.2+            |

JavaScript and WebAssembly must be enabled.

## Contact

For licensing, partnerships, or other inquiries, use the
[contact form](/contact) or email directly via the form on the site.
