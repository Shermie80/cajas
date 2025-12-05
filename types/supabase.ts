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
            profiles: {
                Row: {
                    id: string
                    updated_at: string | null
                    full_name: string | null
                    avatar_url: string | null
                    dni: string | null
                    phone: string | null
                    address: string | null
                    role: 'user' | 'admin'
                }
                Insert: {
                    id: string
                    updated_at?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    dni?: string | null
                    phone?: string | null
                    address?: string | null
                    role?: 'user' | 'admin'
                }
                Update: {
                    id?: string
                    updated_at?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    dni?: string | null
                    phone?: string | null
                    address?: string | null
                    role?: 'user' | 'admin'
                }
            }
            cases: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    price: number
                    image_url: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    price: number
                    image_url: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    price?: number
                    image_url?: string
                    created_at?: string
                }
            }
            case_items: {
                Row: {
                    id: string
                    case_id: string
                    name: string
                    value: number
                    image_url: string
                    probability: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    case_id: string
                    name: string
                    value: number
                    image_url: string
                    probability: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    case_id?: string
                    name?: string
                    value?: number
                    image_url?: string
                    probability?: number
                    created_at?: string
                }
            }
            admin_logs: {
                Row: {
                    id: string
                    admin_id: string | null
                    action: string
                    details: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    admin_id?: string | null
                    action: string
                    details?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    admin_id?: string | null
                    action?: string
                    details?: Json | null
                    created_at?: string
                }
            }
        }
    }
}
