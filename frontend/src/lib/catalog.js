// src/lib/catalog.js
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/** Robust-ish CSV parser (quotes, commas, newlines inside quotes). */
function parseCSV(text) {
  const rows = [];
  let i = 0, cell = '', row = [];
  const pushCell = () => { row.push(cell); cell = ''; };
  const pushRow = () => { rows.push(row); row = []; };

  while (i < text.length) {
    const ch = text[i];

    if (ch === '"') {
      i++;
      while (i < text.length) {
        const c = text[i];
        if (c === '"') {
          if (text[i + 1] === '"') { cell += '"'; i += 2; } else { i++; break; }
        } else { cell += c; i++; }
      }
      if (text[i] === ',') { pushCell(); i++; continue; }
      if (text[i] === '\r' && text[i + 1] === '\n') { pushCell(); i += 2; pushRow(); continue; }
      if (text[i] === '\n') { pushCell(); i++; pushRow(); continue; }
      if (i >= text.length) { pushCell(); break; }
    } else if (ch === ',') { pushCell(); i++; }
    else if (ch === '\r' && text[i + 1] === '\n') { pushCell(); i += 2; pushRow(); }
    else if (ch === '\n') { pushCell(); i++; pushRow(); }
    else { cell += ch; i++; }
  }
  if (cell.length || row.length) { pushCell(); pushRow(); }

  if (rows.length === 0) return [];
  const header = rows[0].map(h => h.trim().toLowerCase());
  return rows.slice(1)
    .filter(r => r.length && r.some(v => v && v.trim().length))
    .map(r => {
      const obj = {};
      for (let j = 0; j < header.length; j++) {
        const key = header[j];
        obj[key] = (r[j] ?? '').trim();
      }
      return obj;
    });
}

async function readCatalogCSV() {
  const root = process.cwd();
  const candidates = [
    join(root, 'src', 'data', 'catalog.csv'),
    join(root, 'data', 'catalog.csv'),
  ];
  let lastErr;
  for (const p of candidates) {
    try { return await readFile(p, 'utf8'); } catch (e) { lastErr = e; }
  }
  const tried = candidates.join('\n  - ');
  throw new Error(`catalog.csv not found. Looked in:\n  - ${tried}\n\nLast error: ${lastErr?.message}`);
}

const nzf = new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD' });

function toNumberOrNull(v) {
  if (!v) return null;
  const n = Number(String(v).replace(/[^\d.]+/g, ''));
  return Number.isFinite(n) ? n : null;
}
function splitPipes(v) {
  return (v || '').split('|').map(s => s.trim()).filter(Boolean);
}

/** Accepts "Label::https://url" or just "https://url". Pipe-separated entries. */
function parseExtraLinks(v) {
  return splitPipes(v).map(entry => {
    const dbl = entry.indexOf('::');
    if (dbl > -1) {
      const label = entry.slice(0, dbl).trim();
      const url = entry.slice(dbl + 2).trim();
      return { label: label || url, url };
    }
    return { label: entry, url: entry };
  });
}

function slugFrom(title, id) {
  const base = (id || title || '').toString().toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || 'item';
}

/**
 * CSV schema:
 * partnumber, title, category, description, image, retailprice, memberprice, instructionsheet, extralinks, tags
 */
export async function getCatalog() {
  const raw = await readCatalogCSV();
  const rows = parseCSV(raw);

  return rows
    .map(r => {
      const partnumber = r.partnumber || r.uid || r.slug || '';
      const title = r.title || '';
      const category = r.category || 'General';
      const description = r.description || '';
      const image = r.image || '/products/placeholder.webp'; // <— updated fallback
      const retail = toNumberOrNull(r.retailprice);
      const member = toNumberOrNull(r.memberprice);
      const instructionsheet = r.instructionsheet || '';
      const extralinks = parseExtraLinks(r.extralinks);
      const tags = splitPipes(r.tags);

      return {
        partnumber,
        slug: slugFrom(title, partnumber),
        title,
        category,
        description,
        image,
        retailPrice: retail,
        memberPrice: member,
        instructionSheet: instructionsheet,
        extraLinks: extralinks,
        tags,
        retailPriceText: retail != null ? nzf.format(retail) : null,
        memberPriceText: member != null ? nzf.format(member) : null,
      };
    })
    .filter(i => i.title && i.partnumber);
}
