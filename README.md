# Portfolio — Celso tkr

Portfolio de développeur web, style Apple (blanc, bleu, minimaliste), avec une **intro en motion design** d'environ 27 s inspirée des pubs « typo cinétique + interface ».

## Contenu

| Fichier | Rôle |
| --- | --- |
| `index.html` | La page du portfolio |
| `assets/js/content.js` | **Tous les textes** : nom, projets, stack, contact, textes de l'intro. C'est le seul fichier à modifier. |
| `assets/js/intro.js` | La timeline de l'intro animée |
| `assets/js/site.js` | Remplit la page et gère les apparitions au scroll |
| `assets/css/style.css` | Styles du site et de l'intro |
| `tools/render-video.mjs` | Exporte l'intro en MP4 |
| `video/` | Les vidéos exportées (16:9 et 9:16) |

## Voir le site en local

Aucune installation nécessaire, c'est un site statique :

```bash
npx serve .
```

- L'intro se joue à la première visite de la session (bouton **Passer l'intro** ou touche Échap).
- `?intro` dans l'URL force l'intro, le bouton **Revoir l'intro** la relance.
- Si l'utilisateur a activé « réduire les animations », l'intro est sautée.

## Personnaliser

Ouvre `assets/js/content.js` et remplace les textes provisoires : projets, email, liens, domaine, stats, texte « À propos ».
Les couleurs sont définies en haut de `assets/css/style.css` (`--blue`, `--blue-bright`, `--blue-deep`).

## Réexporter la vidéo

Après avoir modifié les textes, relance l'export pour mettre les vidéos à jour (nécessite Node, Playwright et ffmpeg) :

```bash
node tools/render-video.mjs              # video/intro-16x9.mp4  (1920×1080)
node tools/render-video.mjs --vertical   # video/intro-9x16.mp4  (1080×1920, TikTok / Reels)
```

Le rendu se fait image par image, donc la vidéo est parfaitement fluide quelle que soit la machine. Les vidéos n'ont pas de son : ajoute une musique dans ton logiciel de montage ou dans TikTok.

## Vidéo promo (40 s)

Une vidéo promo de 40 s, en 9:16 et 16:9, avec voix off, musique, bruitages et sous-titres. Elle reprend les couleurs et la typo du site.

| Fichier | Rôle |
| --- | --- |
| `promo/content.js` | **Tous les textes** de la promo : projets, tarifs, voix off (avec minutage), contact |
| `promo/captures/` | Captures réelles des projets (une capture = un cadre de navigateur dans la vidéo) |
| `promo/index.html`, `promo.css`, `promo.js` | La composition animée (105 BPM, coupes sur le temps) |
| `promo/miniature.html` | La miniature 1280×720 |
| `tools/promo-audio.py` | Voix off (voix française « tom », Piper), musique, bruitages, ducking −8 dB |
| `tools/render-promo.mjs` | Export MP4 image par image avec la bande-son |

```bash
pip install numpy scipy soundfile sherpa-onnx   # une seule fois
node tools/render-promo.mjs            # video/promo-9x16.mp4 (génère aussi la bande-son)
node tools/render-promo.mjs --wide     # video/promo-16x9.mp4
node tools/render-promo.mjs --thumb    # video/promo-miniature.jpg
```

- Pour ajouter un projet à l'écran, dépose sa capture (1440 px de large) dans `promo/captures/` et renseigne `capture` dans `promo/content.js`. Sans capture, le projet apparaît seulement par son nom dans l'écran « Et aussi ».
- `whatsapp` et `photo` dans `promo/content.js` ajoutent le numéro sous le bouton WhatsApp et ta photo ronde à la fin.
- Les répliques déjà synthétisées sont réutilisées (`promo/build/vo/`). Supprime ce dossier pour régénérer la voix.
- Pour prévisualiser : `npx serve .`, puis ouvre `/promo/` et clique sur « Lire la promo ».

## Mettre en ligne

Le site fonctionne tel quel sur **Vercel**, **Netlify** ou **GitHub Pages** (dossier racine, sans étape de build).
