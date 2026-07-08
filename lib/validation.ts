import { z } from 'zod'

// Validation du numéro de téléphone sénégalais
export const phoneSchema = z
  .string()
  .min(1, 'Le numéro de téléphone est requis')
  .transform((val) => val.replace(/\s/g, '')) // Retirer les espaces
  .refine(
    (val) => {
      // Accepter +221XXXXXXXXX ou 7XXXXXXXX (9 chiffres commençant par 7)
      return /^\+221[7][0-9]{8}$/.test(val) || /^[7][0-9]{8}$/.test(val)
    },
    {
      message: 'Le numéro doit être au format +221XXXXXXXXX ou 7XXXXXXXX',
    }
  )
  .transform((val) => {
    // Normaliser au format +221XXXXXXXXX
    if (!val.startsWith('+221')) {
      return `+221${val}`
    }
    return val
  })

// Validation du formulaire de commande
export const checkoutSchema = z.object({
  customer_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  customer_phone: phoneSchema,
  customer_email: z.string().email('Email invalide').optional().or(z.literal('')),
  delivery_address: z.string().min(10, 'L\'adresse doit être plus détaillée'),
  delivery_note: z.string().optional(),
  payment_method: z.enum(['wave', 'cash_on_delivery']),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>

// Validation du formulaire produit (admin)
export const productSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  category_id: z.string().uuid('Catégorie invalide'),
  description: z.string().optional(),
  price: z.number().int().min(0, 'Le prix doit être positif'),
  compare_at_price: z.number().int().min(0).optional().nullable(),
  stock: z.number().int().min(0, 'Le stock doit être positif'),
  image_orientation: z.enum(['portrait', 'landscape']),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
})

export type ProductFormData = z.infer<typeof productSchema>

// Validation du formulaire catégorie
export const categorySchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  position: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
})

export type CategoryFormData = z.infer<typeof categorySchema>

// Validation du formulaire avis
export const reviewSchema = z.object({
  product_id: z.string().uuid(),
  author_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  rating: z.number().int().min(1).max(5),
  content: z.string().min(10, 'L\'avis doit contenir au moins 10 caractères'),
})

export type ReviewFormData = z.infer<typeof reviewSchema>

// Génération de slug à partir d'un texte
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Décomposer les caractères accentués
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9]+/g, '-') // Remplacer les caractères non alphanumériques par des tirets
    .replace(/^-+|-+$/g, '') // Supprimer les tirets au début et à la fin
}
