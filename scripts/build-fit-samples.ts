/**
 * The two sample Fit Report PDFs the product page offers.
 *
 *   npx tsx scripts/build-fit-samples.ts
 *
 * Writes `public/samples/fit-report-sample-{th,en}.pdf`, both tracked, both
 * linked from `/products/fit-report`.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS
 * ---------------------------------------------------------------------------
 *
 * They were printed by hand from a browser, which is why they went three weeks
 * stale without anyone noticing: the report's last page was rewritten to list
 * the roles PunProfile actually sent, and the published sample kept showing the
 * page before that. A file nobody can regenerate drifts from the product it is
 * supposed to be a picture of, and the only warning is a visitor reading it.
 *
 * `report.ts` says the headless-Chrome route "remains open as a later step: it
 * would render THIS html". This is that step, and it renders exactly that html,
 * so the sample and the delivered document cannot differ by anything except
 * when they were made.
 *
 * ---------------------------------------------------------------------------
 * WHAT IT IS CAREFUL ABOUT
 * ---------------------------------------------------------------------------
 *
 * **The candidate is invented.** `fitSampleInput` is the fixture section 3 of
 * `CLAUDE.md` names as the only one anything candidate-shaped may be drawn
 * from. No real record is read, and the cover and every footer say sample.
 *
 * **The page is served over HTTP, not opened as a file.** Both matter. From a
 * `file://` origin Chrome decodes every picture and re-embeds it, which turned
 * a 300kB sample into 5MB; served, it keeps the JPEG and PNG bytes this repo
 * already holds. The origin is this repo's own `public/`, so the sample carries
 * the pictures this commit holds rather than whatever the deployed site is
 * serving.
 *
 * **Fonts have to arrive before the page is printed.** `report.ts` warns that a
 * PDF printed before `document.fonts.ready` is set in the fallback stack, and
 * the document loads Inter and Anuphan from Google Fonts, so this needs the
 * network. The virtual time budget below is what gives them time; it is not a
 * guess at how slow the machine is, since virtual time advances only while the
 * page is idle.
 *
 * **The pictures have to be in the file.** The samples this replaces hold no
 * images at all: whoever printed them did it with the asset paths unresolved,
 * so the cover photograph, the country band and the logos are simply absent,
 * and the files are a sixteenth of the size for that reason rather than because
 * they were better made. Nothing said so until someone counted the image
 * objects, which is why the run now fails on a file with none.
 *
 * **Sheets are not sections.** The document carries a paginator that regroups
 * sections at load time, so nine sections can legitimately print as ten pages
 * when one of them needs two sheets. The count is reported, and only an
 * impossible one fails the run.
 *
 * **macOS only**, like `blog:cards`, because it shells out to the installed
 * Chrome rather than carrying a copy of Chromium.
 *
 * ---------------------------------------------------------------------------
 * WHY THE FILE IS 5MB AND WHAT WOULD MAKE IT SMALLER
 * ---------------------------------------------------------------------------
 *
 * Four of those megabytes are one picture: the country band, 2106x925, stored
 * losslessly. `report.ts` flattens that band into a single image on purpose, so
 * that macOS Preview cannot draw its overlay wrongly, and Chrome rasterises the
 * flattened layer at print resolution and keeps it lossless. Neither the device
 * scale factor nor serving the assets differently changes it; both were tried.
 *
 * Re-encoding that one image as JPEG inside the finished PDF would take most of
 * it back, and needs a tool this machine does not have. Until then the sample a
 * visitor downloads is 5MB, which is worth knowing before it is linked from a
 * page aimed at phones.
 */

import { execFile, execFileSync } from "node:child_process";
import { createReadStream, mkdirSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";

import { extname, join, normalize, resolve } from "node:path";
import { renderFitReport } from "../src/lib/report.js";
import { fitSampleInput, fitSampleMeta } from "../src/lib/fit-sample.js";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const ROOT = resolve(import.meta.dirname, "..");
const PUBLIC = join(ROOT, "public");
const OUT = join(PUBLIC, "samples");

/** Long enough for the webfonts to land. Virtual time only advances while the
 *  page is idle, so this is a budget rather than a sleep. */
const TIME_BUDGET_MS = 30000;
/** A sheet per section at least, and the paginator may need one or two more. */
const MAX_EXTRA_SHEETS = 3;

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".css": "text/css",
  ".woff2": "font/woff2",
};

function chromeVersion(): string {
  try {
    return execFileSync(CHROME, ["--version"], { encoding: "utf8" }).trim();
  } catch {
    console.error(`No Chrome at ${CHROME}. This script prints with the installed browser, macOS only.`);
    process.exit(1);
  }
}

function print(cmd: string, args: string[]): Promise<void> {
  return new Promise((ok, no) => {
    execFile(cmd, args, (err) => (err ? no(err) : ok()));
  });
}

/** Pages and pictures in a PDF, counted off the objects rather than by opening it. */
function inspect(file: string): { pages: number; images: number } {
  const raw = readFileSync(file).toString("latin1");
  return {
    pages: (raw.match(/\/Type\s*\/Page[^s]/g) ?? []).length,
    images: (raw.match(/\/Subtype\s*\/Image/g) ?? []).length,
  };
}

async function main() {
  const version = chromeVersion();
  mkdirSync(OUT, { recursive: true });

  /** The report under test, swapped per locale while the server stays up. */
  let page = "";

  const server = createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    if (url.pathname === "/__report.html") {
      res.writeHead(200, { "content-type": TYPES[".html"] });
      res.end(page);
      return;
    }
    // Inside `public/` and nowhere else: the path is normalised first, so a
    // `..` in a rendered src cannot reach the rest of the repo.
    const file = join(PUBLIC, normalize(url.pathname));
    if (!file.startsWith(PUBLIC + "/")) {
      res.writeHead(403).end();
      return;
    }
    try {
      if (!statSync(file).isFile()) throw new Error("not a file");
    } catch {
      console.warn(`  missing asset: ${url.pathname}`);
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
    createReadStream(file).pipe(res);
  });

  await new Promise<void>((ok) => server.listen(0, "127.0.0.1", ok));
  const address = server.address();
  const origin = `http://127.0.0.1:${typeof address === "object" && address ? address.port : 0}`;

  const failures: string[] = [];
  try {
    for (const locale of ["th", "en"] as const) {
      page = renderFitReport(fitSampleInput(), fitSampleMeta(locale), { locale, assetOrigin: origin });

      const pdf = join(OUT, `fit-report-sample-${locale}.pdf`);
      // Not the synchronous call. The page is served by this very process, so
      // blocking the event loop while Chrome fetches it is a deadlock: Chrome
      // waits for the document, and nothing is left running to send it.
      await print(
        CHROME,
        [
          "--headless=new",
          "--disable-gpu",
          "--no-sandbox",
          "--no-pdf-header-footer",
          "--run-all-compositor-stages-before-draw",
          `--virtual-time-budget=${TIME_BUDGET_MS}`,
          `--print-to-pdf=${pdf}`,
          `${origin}/__report.html`,
        ],
      );

      const sections = (page.match(/<section class="fit-sec"/g) ?? []).length;
      const { pages, images } = inspect(pdf);
      const kB = Math.round(statSync(pdf).size / 1024);
      console.log(`${locale}: ${sections} sections -> ${pages} pages, ${images} pictures, ${kB}kB`);
      if (images === 0) {
        failures.push(`${locale}: no pictures in the file. The asset origin did not resolve.`);
      }
      if (pages < sections || pages > sections + MAX_EXTRA_SHEETS) {
        failures.push(`${locale}: ${pages} pages for ${sections} sections, which the paginator cannot explain.`);
      }
    }
  } finally {
    server.close();
  }

  console.log(`printed with ${version}`);
  if (failures.length) {
    for (const f of failures) console.error(f);
    process.exit(1);
  }
}

void main();
