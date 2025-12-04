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
                }
                Insert: {
                    id: string
                    updated_at?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    dni?: string | null
                    phone?: string | null
                    address?: string | null
                }
                Update: {
                    id?: string
                    updated_at?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    dni?: string | null
                    phone?: string | null
                    address?: string | null
                }
            }
        }
    }
}
