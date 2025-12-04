# 🌟 Immers'Write

> **Write stories beyond words**

Plateforme d'écriture et de lecture immersive et interactive, permettant une expérience narrative enrichie par du contenu multimédia synchronisé.

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)

---

## ✨ Fonctionnalités

### 🖋️ Pour les Auteurs
- **Éditeur WYSIWYG avancé** basé sur Tiptap
- **Intégration multimédia native** : Audio, images, vidéos
- **Triggers immersifs** : Déclenchement automatique d'ambiances au scroll
- **Sauvegarde automatique** toutes les 30 secondes
- **Versioning** : Historique des modifications
- **Media Manager** : Bibliothèque centralisée par œuvre

### 📖 Pour les Lecteurs
- **Lecture immersive** : Texte + ambiances sonores + illustrations synchronisées
- **Personnalisation** : Thèmes visuels, taille de police, mode nuit
- **Progression** : Suivi de lecture, temps estimé, bookmarks
- **Interaction** : Commentaires et réactions

### 🌐 Communautaire
- **Lexique interactif** : Dictionnaire des langues inventées
- **Chronologie** : Frise temporelle des événements
- **Cartes interactives** : Géographie des univers

---

## 🚀 Technologies

- **Framework** : Next.js 15 (App Router)
- **Langage** : TypeScript
- **Base de données** : PostgreSQL + Prisma ORM
- **Éditeur** : Tiptap (ProseMirror)
- **UI** : Tailwind CSS + shadcn/ui
- **Stockage** : Cloudflare R2
- **Animation** : Framer Motion

---

## 📦 Installation

### Prérequis
- Node.js 18+
- PostgreSQL (ou compte Neon/Supabase)
- Git

### Étapes

```bash
# Cloner le repository
git clone https://github.com/VOTRE-USERNAME/immers-write.git
cd immers-write

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditez .env avec vos valeurs

# Générer le client Prisma
npx prisma generate

# Créer la base de données
npx prisma migrate dev

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 🗂️ Structure du Projet

```
immers-write/
├── src/
│   ├── app/                    # App Router (Next.js 14+)
│   │   ├── (auth)/            # Routes d'authentification
│   │   ├── (platform)/        # Routes plateforme (auteur/lecteur)
│   │   └── api/               # API Routes
│   ├── components/
│   │   ├── author/            # Composants auteur (éditeur)
│   │   ├── reader/            # Composants lecteur
│   │   ├── ui/                # Composants UI (shadcn)
│   │   └── layout/            # Header, Footer, Sidebar
│   ├── lib/                   # Librairies (Prisma, utils)
│   ├── hooks/                 # Custom React Hooks
│   ├── types/                 # Types TypeScript
│   └── actions/               # Server Actions
├── prisma/
│   └── schema.prisma          # Schéma base de données
└── public/                    # Assets statiques
```

---

## 🎨 Charte Graphique

### Palette de Couleurs
- **Deep Space Blue** : `#28364e` - Background principal
- **Metallic Gold** : `#d4b044` - Accents nobles
- **Lavender** : `#E5E6F1` - Backgrounds clairs
- **Brick Ember** : `#bf0000` - Accents dramatiques
- **Indigo** : `#560078` - Accents mystiques

### Typographies
- **Titres** : Cinzel Decorative (antique, sacré)
- **Sous-titres** : Cinzel (hiératique)
- **Texte courant** : Merriweather (intemporel)
- **Langue inventée** : Macondo Swash Caps

---

## 🛠️ Commandes Utiles

```bash
# Développement
npm run dev              # Lance le serveur (port 3000)
npm run build            # Build de production
npm start                # Démarre en production

# Base de données
npx prisma studio        # Interface web pour la BDD
npx prisma generate      # Génère le client Prisma
npx prisma migrate dev   # Crée une migration

# Linting & Formatting
npm run lint             # Vérifie le code
npm run format           # Formate avec Prettier
```

---

## 🗺️ Roadmap

### ✅ Phase 1 : MVP (En cours)
- [x] Setup Next.js + TypeScript + Tailwind
- [x] Configuration Prisma
- [x] Éditeur Tiptap avec extensions custom
- [ ] Media Manager (upload R2)
- [ ] Système d'authentification
- [ ] Lecteur immersif avec triggers

### 📋 Phase 2 : Enrichissement
- [ ] Système de commentaires
- [ ] Lexique interactif
- [ ] Chronologie et cartes
- [ ] Analytics auteur
- [ ] Exportation (PDF, EPUB)

### 🚀 Phase 3 : Communauté
- [ ] Profils utilisateurs
- [ ] Système de follow
- [ ] Notifications
- [ ] Modèle freemium

---

## 📝 Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👤 Auteur

**Laure Lavie**
- GitHub : [@LaureLavie](https://github.com/LaureLavie)
- Email : lorlaviedevdesign@gmail.com

---

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) - Framework React
- [Tiptap](https://tiptap.dev/) - Éditeur de texte extensible
- [Prisma](https://www.prisma.io/) - ORM moderne
- [shadcn/ui](https://ui.shadcn.com/) - Composants UI

---

<div align="center">
  <strong>✨ Write stories beyond words ✨</strong>
</div>