#!/usr/bin/env python3
"""yuzaa · outils/images.py

Génère les tailles réduites des photos (assets/img/r/<nom>-<largeur>.webp) et le fichier
js/img-tailles.js qui les liste. Le site s'en sert pour remplir srcset : un téléphone télécharge
une photo de 540 ou 720 px au lieu de l'original de 1 200 ou 1 600 px.

Usage : python3 outils/images.py   (depuis la racine du dépôt, Pillow requis)
À relancer après l'ajout ou le remplacement d'une photo dans assets/img/.
"""
import json
import os
from pathlib import Path

from PIL import Image

RACINE = Path(__file__).resolve().parent.parent
SRC = RACINE / 'assets' / 'img'
DEST = SRC / 'r'
LARGEURS = [360, 480, 600, 720, 960, 1280]
QUALITE = 78


def main():
    DEST.mkdir(exist_ok=True)
    tailles = {}
    for f in sorted(SRC.iterdir()):
        if f.suffix.lower() not in ('.webp', '.jpg', '.jpeg', '.png') or not f.is_file():
            continue
        im = Image.open(f)
        w, h = im.size
        cles = []
        for lw in LARGEURS:
            if lw >= w * 0.92:
                break
            lh = round(h * lw / w)
            nom = f'{f.stem}-{lw}.webp'
            out = DEST / nom
            if not out.exists() or out.stat().st_mtime < f.stat().st_mtime:
                im2 = im.convert('RGBA' if im.mode in ('RGBA', 'LA', 'P') else 'RGB').resize((lw, lh), Image.LANCZOS)
                im2.save(out, 'WEBP', quality=QUALITE, method=6)
            cles.append([lw, f'assets/img/r/{nom}'])
        if cles:
            cles.append([w, f'assets/img/{f.name}'])
            tailles[f'assets/img/{f.name}'] = cles
    # nettoie les variantes orphelines
    gardes = {Path(u).name for v in tailles.values() for _, u in v}
    for f in DEST.iterdir():
        if f.name not in gardes:
            f.unlink()
    js = ('/* yuzaa · img-tailles.js (généré par outils/images.py, ne pas modifier à la main)\n'
          '   Tailles disponibles de chaque photo, pour l\'attribut srcset. */\n'
          'const IMGW=' + json.dumps(tailles, ensure_ascii=False, separators=(',', ':')) + ';\n')
    (RACINE / 'js' / 'img-tailles.js').write_text(js, encoding='utf-8')
    total = sum(os.path.getsize(DEST / Path(u).name) for v in tailles.values() for _, u in v if '/r/' in u)
    print(f'{len(tailles)} photos, {sum(len(v) - 1 for v in tailles.values())} variantes ({total // 1024} Ko)')


if __name__ == '__main__':
    main()
