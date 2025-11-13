Suivi du Fonds de Prevoyance - Projet Web

Contenu:
- public/index.html
- src/app.js

Mot de passe pour acceder a l'app: Cyril

GUIDE: Publier sur GitHub Pages (statique)
1) Cree un repository sur GitHub (public).
2) Place les fichiers contenus dans le dossier 'public' a la racine du repo.
   - index.html
   - src/ (le dossier src doit etre present)
3) Dans GitHub: Settings -> Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)

GUIDE: Publier sur Vercel (recommande)
1) Cree un compte sur https://vercel.com et connecte ton GitHub.
2) Import le repository.
3) Vercel detecte l'app et la publie automatiquement.

Notes sur les colonnes 'Ecart':
- Colonnes detectees automatiquement (indices: [13, 15, 17]).
- Elles sont calculees automatiquement par l'application en utilisant la formule: Ecart = Reel - Prevu
- Heuristique: pour une colonne Ecart en position C, l'app utilise:
    Reel = cellule en colonne (C - 1)
    Prevu = cellule en colonne (C - 2)

If this heuristic is incorrect for your file, tell me and I will adjust the mapping.
