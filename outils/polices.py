#!/usr/bin/env python3
"""yuzaa · outils/polices.py

Régénère les deux polices hébergées sur le site (assets/fonts/) :
  - Bricolage Grotesque (titres) : axes opsz 12-96 et wght 500-800 ;
  - DM Sans (texte) : axes opsz 9-40 et wght 400-700.

Étapes : téléchargement des fichiers « latin » de Google Fonts, puis réduction aux seuls
caractères utilisés par le site (lus dans js/, css/ et outils/gabarit.html, plus l'ASCII et les
lettres accentuées du français). Le résultat (environ 60 Ko + 30 Ko) remplace l'appel à Google
Fonts : une connexion de moins, et le texte s'affiche plus tôt.

Usage : python3 outils/polices.py   (depuis la racine du dépôt ; fontTools et brotli requis :
        pip install fonttools brotli)
À relancer seulement si le site utilise un nouveau caractère spécial (symbole, langue…).
Ensuite : node outils/build.mjs, puis commit et push.
"""
import io
import re
import urllib.request
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

RACINE = Path(__file__).resolve().parent.parent
DEST = RACINE / 'assets' / 'fonts'
CSS_GOOGLE = ('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800'
              '&family=DM+Sans:opsz,wght@9..40,400..700&display=swap')
# Un navigateur récent, pour que Google Fonts renvoie des fichiers woff2 variables
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36'
POLICES = {
    'Bricolage Grotesque': ('bricolage-grotesque-latin.woff2', {'wght': (500, 800)}),
    'DM Sans': ('dm-sans-latin.woff2', {'wght': (400, 700)}),
}
FRANCAIS = ("àâäçéèêëîïôöùûüÿœæÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸŒÆ«»’‘“”…–—·€×÷±°²³½¼¾ñÑáíóúÁÍÓÚãõÃÕ©®™•→←↑↓−‹›‚„′″≈≤  ")


def telecharger(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def caracteres():
    texte = set(chr(c) for c in range(0x20, 0x7f)) | set(FRANCAIS)
    for f in list((RACINE / 'js').glob('*.js')) + list((RACINE / 'css').glob('*.css')) + [RACINE / 'outils' / 'gabarit.html']:
        texte |= set(f.read_text(encoding='utf-8'))
    # pas les caractères de contrôle, les emojis ni les marques combinantes isolées
    garde = sorted(c for c in texte if ord(c) >= 0x20 and not 0x300 <= ord(c) <= 0x36f and (ord(c) < 0x2600 or c == '€'))
    return ''.join(garde)


def main():
    css = telecharger(CSS_GOOGLE).decode('utf-8')
    # chaque bloc @font-face est précédé d'un commentaire /* latin */, /* latin-ext */…
    blocs = re.findall(r'/\* ([\w-]+) \*/\s*@font-face \{(.*?)\}', css, re.S)
    texte = caracteres()
    (RACINE / 'outils' / 'caracteres-polices.txt').write_text(texte, encoding='utf-8')
    DEST.mkdir(parents=True, exist_ok=True)
    for famille, (nom, axes) in POLICES.items():
        url = next(re.search(r'url\((https://[^)]+\.woff2)\)', b).group(1)
                   for sous, b in blocs if sous == 'latin' and f"font-family: '{famille}'" in b)
        police = TTFont(io.BytesIO(telecharger(url)))
        options = subset.Options()
        options.layout_features = ['*']
        options.flavor = None
        sub = subset.Subsetter(options)
        sub.populate(text=texte)
        sub.subset(police)
        police = instancer.instantiateVariableFont(police, axes)
        police.flavor = 'woff2'
        police.save(DEST / nom)
        print(f'{nom} : {(DEST / nom).stat().st_size // 1024} Ko, {len(police.getGlyphOrder())} glyphes')
    print(f'{len(texte)} caractères gardés (outils/caracteres-polices.txt)')


if __name__ == '__main__':
    main()
