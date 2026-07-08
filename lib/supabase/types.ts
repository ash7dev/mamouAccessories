export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          position: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          position?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          position?: number
          is_active?: boolean
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          category_id: string
          name: string
          slug: string
          description: string | null
          price: number
          compare_at_price: number | null
          stock: number
          image_orientation: 'portrait' | 'landscape'
          is_featured: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          slug: string
          description?: string | null
          price: number
          compare_at_price?: number | null
          stock?: number
          image_orientation?: 'portrait' | 'landscape'
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          slug?: string
          description?: string | null
          price?: number
          compare_at_price?: number | null
          stock?: number
          image_orientation?: 'portrait' | 'landscape'
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          cloudinary_public_id: string
          position: number
        }
        Insert: {
          id?: string
          product_id: string
          cloudinary_public_id: string
          position?: number
        }
        Update: {
          id?: string
          product_id?: string
          cloudinary_public_id?: string
          position?: number
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_name: string
          customer_phone: string
          customer_email: string | null
          delivery_address: string
          delivery_note: string | null
          payment_method: 'wave' | 'cash_on_delivery'
          payment_status: 'unpaid' | 'pending_verification' | 'paid' | 'refunded'
          payment_proof_url: string | null
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          cancel_reason: string | null
          subtotal: number
          delivery_fee: number
          total: number
          promo_code_id: string | null
          promo_code: string | null
          discount_amount: number
          admin_note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          customer_name: string
          customer_phone: string
          customer_email?: string | null
          delivery_address: string
          delivery_note?: string | null
          payment_method?: 'wave' | 'cash_on_delivery'
          payment_status?: 'unpaid' | 'pending_verification' | 'paid' | 'refunded'
          payment_proof_url?: string | null
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          cancel_reason?: string | null
          subtotal: number
          delivery_fee?: number
          total: number
          promo_code_id?: string | null
          promo_code?: string | null
          discount_amount?: number
          admin_note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_name?: string
          customer_phone?: string
          customer_email?: string | null
          delivery_address?: string
          delivery_note?: string | null
          payment_method?: 'wave' | 'cash_on_delivery'
          payment_status?: 'unpaid' | 'pending_verification' | 'paid' | 'refunded'
          payment_proof_url?: string | null
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          cancel_reason?: string | null
          subtotal?: number
          delivery_fee?: number
          total?: number
          promo_code_id?: string | null
          promo_code?: string | null
          discount_amount?: number
          admin_note?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          unit_price: number
          quantity: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          unit_price: number
          quantity: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          unit_price?: number
          quantity?: number
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          author_name: string
          rating: number
          content: string
          is_approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          author_name: string
          rating: number
          content: string
          is_approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          author_name?: string
          rating?: number
          content?: string
          is_approved?: boolean
          created_at?: string
        }
      }
      settings: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
      }
      promotions: {
        Row: {
          id: string
          name: string
          description: string | null
          discount_type: 'percentage' | 'fixed_amount'
          discount_value: number
          start_date: string
          end_date: string
          applies_to: 'all_products' | 'specific_category' | 'specific_products'
          category_id: string | null
          min_purchase_amount: number
          max_discount_amount: number | null
          is_active: boolean
          usage_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          discount_type: 'percentage' | 'fixed_amount'
          discount_value: number
          start_date: string
          end_date: string
          applies_to: 'all_products' | 'specific_category' | 'specific_products'
          category_id?: string | null
          min_purchase_amount?: number
          max_discount_amount?: number | null
          is_active?: boolean
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          discount_type?: 'percentage' | 'fixed_amount'
          discount_value?: number
          start_date?: string
          end_date?: string
          applies_to?: 'all_products' | 'specific_category' | 'specific_products'
          category_id?: string | null
          min_purchase_amount?: number
          max_discount_amount?: number | null
          is_active?: boolean
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      promotion_products: {
        Row: {
          promotion_id: string
          product_id: string
        }
        Insert: {
          promotion_id: string
          product_id: string
        }
        Update: {
          promotion_id?: string
          product_id?: string
        }
      }
      promo_codes: {
        Row: {
          id: string
          code: string
          description: string | null
          discount_type: 'percentage' | 'fixed_amount'
          discount_value: number
          start_date: string
          end_date: string
          min_purchase_amount: number
          max_discount_amount: number | null
          usage_limit: number | null
          usage_count: number
          usage_limit_per_customer: number | null
          applies_to: 'all_products' | 'specific_category' | 'specific_products'
          category_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          description?: string | null
          discount_type: 'percentage' | 'fixed_amount'
          discount_value: number
          start_date: string
          end_date: string
          min_purchase_amount?: number
          max_discount_amount?: number | null
          usage_limit?: number | null
          usage_count?: number
          usage_limit_per_customer?: number | null
          applies_to?: 'all_products' | 'specific_category' | 'specific_products'
          category_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          description?: string | null
          discount_type?: 'percentage' | 'fixed_amount'
          discount_value?: number
          start_date?: string
          end_date?: string
          min_purchase_amount?: number
          max_discount_amount?: number | null
          usage_limit?: number | null
          usage_count?: number
          usage_limit_per_customer?: number | null
          applies_to?: 'all_products' | 'specific_category' | 'specific_products'
          category_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      promo_code_products: {
        Row: {
          promo_code_id: string
          product_id: string
        }
        Insert: {
          promo_code_id: string
          product_id: string
        }
        Update: {
          promo_code_id?: string
          product_id?: string
        }
      }
      promo_code_usage: {
        Row: {
          id: string
          promo_code_id: string
          order_id: string
          customer_phone: string
          discount_amount: number
          used_at: string
        }
        Insert: {
          id?: string
          promo_code_id: string
          order_id: string
          customer_phone: string
          discount_amount: number
          used_at?: string
        }
        Update: {
          id?: string
          promo_code_id?: string
          order_id?: string
          customer_phone?: string
          discount_amount?: number
          used_at?: string
        }
      }
    }
    Views: {
      customer_summary: {
        Row: {
          customer_phone: string
          name: string
          orders_count: number
          total_spent: number
          last_order_at: string
        }
      }
    }
  }
}
