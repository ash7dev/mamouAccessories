# 🎨 Design System - Palette Ivoire & Or

Guide complet d'utilisation des couleurs pour la bijouterie.

---

## 📋 Palette de Couleurs

### Couleurs Principales

| Couleur | HEX | Usage | Classe Tailwind |
|---------|-----|-------|----------------|
| **Ivoire** | `#FAF6F0` | Fond principal du site | `bg-background` ou `bg-ivory` |
| **Blanc** | `#FFFFFF` | Cartes produits, modales | `bg-card` |
| **Texte Foncé** | `#2B2118` | Texte principal | `text-foreground` |
| **Or** | `#B98A44` | Boutons CTA, accents | `bg-primary` ou `bg-gold` |
| **Or Foncé** | `#8C6239` | Survol boutons, focus | `hover:bg-gold-dark` |

---

## 🎯 Utilisation par Contexte

### 1. Layout & Navigation

```tsx
// Fond général
<body className="bg-background text-foreground">

// Header
<header className="bg-card border-b border-border">

// Navigation
<nav className="bg-background">
  <a className="text-foreground hover:text-primary">Colliers</a>
</nav>

// Footer
<footer className="bg-muted text-muted-foreground">
```

---

### 2. Cartes Produits

```tsx
// Carte produit
<div className="bg-card rounded-lg shadow-sm border border-border">
  <img src="..." alt="Collier" />

  {/* Nom */}
  <h3 className="text-foreground font-semibold">Collier Élégance</h3>

  {/* Prix */}
  <p className="text-primary text-xl font-bold">15 000 FCFA</p>

  {/* Prix barré (promo) */}
  <p className="text-muted-foreground line-through">20 000 FCFA</p>
</div>
```

---

### 3. Boutons

```tsx
// Bouton principal (CTA)
<button className="bg-primary text-primary-foreground hover:bg-gold-dark">
  Ajouter au panier
</button>

// Bouton secondaire
<button className="bg-secondary text-secondary-foreground hover:bg-muted">
  Voir les détails
</button>

// Bouton destructif
<button className="bg-destructive text-white hover:bg-destructive/90">
  Supprimer
</button>

// Bouton outline
<button className="border-2 border-primary text-primary hover:bg-primary hover:text-white">
  Commander
</button>
```

---

### 4. Formulaires

```tsx
// Champ de saisie
<input
  type="text"
  className="border border-input bg-background text-foreground
             focus:ring-2 focus:ring-ring focus:border-primary"
  placeholder="Votre email"
/>

// Label
<label className="text-sm font-medium text-foreground">
  Nom complet
</label>

// Message d'erreur
<p className="text-destructive text-sm">Ce champ est requis</p>

// Message de succès
<p className="text-primary text-sm">✓ Code promo appliqué</p>
```

---

### 5. Badges & Tags

```tsx
// Badge promo
<span className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-bold">
  -20%
</span>

// Badge rupture
<span className="bg-destructive text-white px-2 py-1 rounded text-sm">
  Rupture de stock
</span>

// Badge nouveau
<span className="bg-accent text-accent-foreground px-2 py-1 rounded text-sm">
  Nouveau
</span>

// Badge catégorie
<span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs">
  Colliers
</span>
```

---

### 6. Statuts Commandes (Admin)

```tsx
// Pending
<span className="bg-muted text-muted-foreground px-3 py-1 rounded-full">
  En attente
</span>

// Confirmed
<span className="bg-primary text-primary-foreground px-3 py-1 rounded-full">
  Confirmée
</span>

// Shipped
<span className="bg-accent text-accent-foreground px-3 py-1 rounded-full">
  Expédiée
</span>

// Delivered
<span className="bg-green-600 text-white px-3 py-1 rounded-full">
  Livrée
</span>

// Cancelled
<span className="bg-destructive text-white px-3 py-1 rounded-full">
  Annulée
</span>
```

---

### 7. Tableaux (Admin)

```tsx
<table className="w-full">
  {/* Header */}
  <thead className="bg-muted">
    <tr>
      <th className="text-left text-muted-foreground font-semibold p-3">
        Produit
      </th>
    </tr>
  </thead>

  {/* Body */}
  <tbody className="bg-card">
    <tr className="border-b border-border hover:bg-secondary">
      <td className="p-3 text-foreground">Collier doré</td>
    </tr>
  </tbody>
</table>
```

---

### 8. Sidebar Admin

```tsx
<aside className="bg-sidebar border-r border-sidebar-border">
  {/* Item normal */}
  <a className="text-sidebar-foreground hover:bg-sidebar-accent
                hover:text-sidebar-accent-foreground">
    Produits
  </a>

  {/* Item actif */}
  <a className="bg-sidebar-primary text-sidebar-primary-foreground">
    Dashboard
  </a>
</aside>
```

---

### 9. Alertes & Notifications

```tsx
// Info
<div className="bg-secondary border-l-4 border-primary p-4">
  <p className="text-secondary-foreground">
    Nouvelle commande reçue
  </p>
</div>

// Succès
<div className="bg-green-50 border-l-4 border-green-600 p-4">
  <p className="text-green-900">
    Produit ajouté avec succès
  </p>
</div>

// Erreur
<div className="bg-red-50 border-l-4 border-destructive p-4">
  <p className="text-red-900">
    Une erreur est survenue
  </p>
</div>

// Avertissement
<div className="bg-yellow-50 border-l-4 border-yellow-600 p-4">
  <p className="text-yellow-900">
    Stock faible : 3 unités restantes
  </p>
</div>
```

---

### 10. Prix & Promotions

```tsx
// Prix normal
<p className="text-foreground text-2xl font-bold">
  15 000 FCFA
</p>

// Prix en promotion
<div className="flex items-center gap-2">
  <p className="text-primary text-2xl font-bold">
    12 000 FCFA
  </p>
  <p className="text-muted-foreground text-lg line-through">
    15 000 FCFA
  </p>
  <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm">
    -20%
  </span>
</div>
```

---

## 🎨 Classes Utilitaires Personnalisées

### Couleurs Directes

```css
/* Backgrounds */
.bg-ivory { background-color: #FAF6F0; }
.bg-gold { background-color: #B98A44; }
.bg-gold-dark { background-color: #8C6239; }

/* Text */
.text-ivory { color: #FAF6F0; }
.text-gold { color: #B98A44; }
.text-gold-dark { color: #8C6239; }

/* Borders */
.border-ivory { border-color: #FAF6F0; }
.border-gold { border-color: #B98A44; }
.border-gold-dark { border-color: #8C6239; }
```

### Exemples d'utilisation

```tsx
// Utilisation de bg-gold au lieu de bg-primary
<button className="bg-gold text-white hover:bg-gold-dark">
  Acheter maintenant
</button>

// Texte doré
<p className="text-gold font-semibold">
  Prix spécial
</p>

// Bordure dorée
<div className="border-2 border-gold rounded-lg">
  Produit mis en avant
</div>
```

---

## 📐 Coins Arrondis (Border Radius)

```tsx
// Petit
<div className="rounded-sm">  {/* 0.3rem */}

// Moyen
<div className="rounded-md">  {/* 0.4rem */}

// Normal (par défaut)
<div className="rounded-lg">  {/* 0.5rem */}

// Grand
<div className="rounded-xl">  {/* 0.7rem */}

// Très grand
<div className="rounded-2xl"> {/* 0.9rem */}

// Cercle parfait
<div className="rounded-full">
```

---

## 🌓 Mode Sombre (Non utilisé pour v1)

Le mode sombre est configuré mais non activé par défaut.
Pour l'activer dans une future version, il suffit d'ajouter la classe `dark` au `<html>`.

---

## ✅ Bonnes Pratiques

### 1. Hiérarchie Visuelle

```tsx
// ✅ BON - Hiérarchie claire
<h1 className="text-3xl font-bold text-foreground">Titre principal</h1>
<h2 className="text-xl font-semibold text-foreground">Sous-titre</h2>
<p className="text-base text-muted-foreground">Texte secondaire</p>

// ❌ MAUVAIS - Manque de contraste
<h1 className="text-muted-foreground">Titre</h1>
<p className="text-foreground">Texte</p>
```

### 2. Contraste des Couleurs

```tsx
// ✅ BON - Contraste suffisant
<button className="bg-primary text-white">Acheter</button>

// ❌ MAUVAIS - Manque de contraste
<button className="bg-ivory text-white">Acheter</button>
```

### 3. Utilisation des Accents

```tsx
// ✅ BON - Accents utilisés avec parcimonie
<div className="bg-card p-6">
  <h3 className="text-foreground">Collier</h3>
  <p className="text-primary text-2xl">15 000 FCFA</p> {/* Accent sur le prix */}
</div>

// ❌ MAUVAIS - Trop d'accents
<div className="bg-primary p-6">
  <h3 className="text-primary">Collier</h3>
  <p className="text-accent">15 000 FCFA</p>
</div>
```

### 4. États Interactifs

```tsx
// ✅ BON - États clairs
<button className="bg-primary hover:bg-gold-dark
                   focus:ring-2 focus:ring-ring
                   active:scale-95
                   disabled:opacity-50 disabled:cursor-not-allowed">
  Ajouter au panier
</button>
```

---

## 🎯 Exemples Complets

### Page Produit

```tsx
<div className="bg-background min-h-screen">
  {/* Header */}
  <header className="bg-card border-b border-border">
    <nav className="container mx-auto flex items-center justify-between py-4">
      <h1 className="text-2xl font-bold text-primary">Mamou Jewelry</h1>
      <div className="flex gap-4">
        <a className="text-foreground hover:text-primary">Boutique</a>
        <a className="text-foreground hover:text-primary">Contact</a>
      </div>
    </nav>
  </header>

  {/* Contenu */}
  <main className="container mx-auto py-8">
    <div className="grid grid-cols-2 gap-8">
      {/* Image */}
      <div className="bg-card rounded-lg p-4">
        <img src="..." alt="Collier" className="w-full" />
      </div>

      {/* Détails */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Collier Élégance
        </h2>

        {/* Prix */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl font-bold text-primary">
            12 000 FCFA
          </span>
          <span className="text-xl text-muted-foreground line-through">
            15 000 FCFA
          </span>
          <span className="bg-primary text-primary-foreground px-3 py-1 rounded">
            -20%
          </span>
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-6">
          Magnifique collier doré avec pendentif élégant...
        </p>

        {/* Bouton */}
        <button className="w-full bg-primary text-primary-foreground
                           hover:bg-gold-dark py-3 rounded-lg font-semibold">
          Ajouter au panier
        </button>
      </div>
    </div>
  </main>
</div>
```

---

## 📚 Ressources

- Variables CSS dans [`app/globals.css`](app/globals.css)
- Composants shadcn/ui utilisent automatiquement ces couleurs
- Palette testée pour l'accessibilité (WCAG AA)

---

**🎨 Design System prêt à l'emploi !**

Toutes les couleurs sont maintenant configurées et utilisables via les classes Tailwind.
