#!/usr/bin/env python3
"""
Script pour générer les icônes PWA à partir du logo
Nécessite: pip install Pillow
"""

from PIL import Image
import os

# Chemin vers le logo
LOGO_PATH = "../public/logo.jpg"
OUTPUT_DIR = "../public"

# Tailles d'icônes nécessaires
ICON_SIZES = {
    "icon-192.png": 192,
    "icon-512.png": 512,
    "apple-touch-icon.png": 180,
    "favicon-32.png": 32,
    "favicon-16.png": 16,
}

def generate_icons():
    """Génère toutes les icônes PWA"""
    try:
        # Ouvrir le logo original
        logo = Image.open(LOGO_PATH)
        print(f"✓ Logo chargé: {logo.size}")

        # Convertir en RGBA si nécessaire
        if logo.mode != 'RGBA':
            logo = logo.convert('RGBA')

        # Générer chaque taille
        for filename, size in ICON_SIZES.items():
            # Redimensionner avec antialiasing
            resized = logo.resize((size, size), Image.Resampling.LANCZOS)

            # Sauvegarder
            output_path = os.path.join(OUTPUT_DIR, filename)
            resized.save(output_path, 'PNG', optimize=True, quality=95)
            print(f"✓ Généré: {filename} ({size}x{size})")

        # Générer aussi favicon.ico (multi-tailles)
        favicon_sizes = [(16, 16), (32, 32), (48, 48)]
        favicon_images = [logo.resize(size, Image.Resampling.LANCZOS) for size in favicon_sizes]
        favicon_path = os.path.join(OUTPUT_DIR, "favicon.ico")
        favicon_images[0].save(
            favicon_path,
            format='ICO',
            sizes=favicon_sizes,
            append_images=favicon_images[1:]
        )
        print(f"✓ Généré: favicon.ico (16x16, 32x32, 48x48)")

        print("\n✅ Toutes les icônes PWA ont été générées avec succès!")

    except FileNotFoundError:
        print(f"❌ Erreur: Le fichier {LOGO_PATH} n'existe pas")
        print("   Assurez-vous que logo.jpg est dans le dossier public/")
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    generate_icons()
