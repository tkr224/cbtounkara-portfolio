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

## Mettre en ligne

Le site fonctionne tel quel sur **Vercel**, **Netlify** ou **GitHub Pages** (dossier racine, sans étape de build).
