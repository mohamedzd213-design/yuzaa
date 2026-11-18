#!/usr/bin/env node
/* yuzaa · outils/serveur.mjs
   Petit serveur local qui se comporte comme Vercel, pour vérifier le site avant de le pousser :
   fichiers d'abord, puis redirections et réécritures de vercel.json, sinon 404.html (statut 404).
   Aucune dépendance.

   Usage, depuis la racine du dépôt :  node outils/serveur.mjs      puis http://localhost:8123
   (un autre port : node outils/serveur.mjs 8080) */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = +(process.argv[2] || 8123);
const TYPES = {'.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json', '.ico': 'image/x-icon'};

const conf = () => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8')); } catch (e) { return {}; } };
// les motifs de vercel.json utilisés ici sont des chemins simples ou des expressions régulières
const re = src => new RegExp('^' + src.replace(/\//g, '\\/') + '$');
function fichier(p) {
  const f = path.join(ROOT, decodeURIComponent(p));
  if (!f.startsWith(ROOT)) return null;
  try {
    const st = fs.statSync(f);
    if (st.isFile()) return f;
    if (st.isDirectory() && fs.existsSync(path.join(f, 'index.html'))) return path.join(f, 'index.html');
  } catch (e) {}
  return null;
}
function envoyer(req, res, f, statut, entetes) {
  let corps = fs.readFileSync(f);
  const h = {'Content-Type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream', ...entetes};
  if (/text|javascript|json|xml|svg|manifest/.test(h['Content-Type']) && /gzip/.test(req.headers['accept-encoding'] || '')) {
    corps = zlib.gzipSync(corps);
    h['Content-Encoding'] = 'gzip';
  }
  h['Content-Length'] = corps.length;
  res.writeHead(statut, h);
  res.end(req.method === 'HEAD' ? undefined : corps);
}
http.createServer((req, res) => {
  const c = conf();
  const p = new URL(req.url, 'http://local').pathname;
  if (c.trailingSlash === false && p.length > 1 && p.endsWith('/')) { res.writeHead(308, {Location: p.slice(0, -1)}); return res.end(); }
  for (const r of c.redirects || []) {
    if (re(r.source).test(p)) { res.writeHead(r.permanent ? 308 : 307, {Location: r.destination}); return res.end(); }
  }
  const entetes = {};
  for (const r of c.headers || []) if (re(r.source).test(p)) for (const kv of r.headers) entetes[kv.key] = kv.value;
  let f = fichier(p);
  for (const r of f ? [] : c.rewrites || []) {
    const m = p.match(re(r.source));
    if (m && (f = fichier(r.destination.replace(/\$(\d)/g, (_, i) => m[+i] || '')))) break;
  }
  if (f) return envoyer(req, res, f, 200, entetes);
  const nf = path.join(ROOT, '404.html');
  if (fs.existsSync(nf)) return envoyer(req, res, nf, 404, entetes);
  res.writeHead(404);
  res.end('404');
}).listen(PORT, () => console.log(`Site yuzaa en local : http://localhost:${PORT}`));
