'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const itemSchema = z.object({
    name: z.string().min(1, 'Item name is required'),
    value: z.number().min(0, 'Value must be positive'),
    image_url: z.string().url('Invalid image URL'),
    probability: z.number().min(0).max(100),
})

const caseSchema = z.object({
    name: z.string().min(1, 'Case name is required'),
    description: z.string().optional(),
    price: z.number().min(0, 'Price must be positive'),
    image_url: z.string().url('Invalid image URL'),
    items: z.array(itemSchema)
        .min(2, 'Case must have at least 2 items')
        .max(15, 'Case must have at most 15 items')
        .refine((items) => {
            const total = items.reduce((sum, item) => sum + item.probability, 0)
            return Math.abs(total - 100) < 0.01
        }, 'Total probability must be exactly 100%'),
})

export type CreateCaseState = {
    success?: boolean
    error?: string
    errors?: Record<string, string[]>
}

export async function createCase(prevState: CreateCaseState, formData: FormData): Promise<CreateCaseState> {
    const supabase = await createClient()

    // 1. Check Auth & Admin Role
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { error: 'Unauthorized' }
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        return { error: 'Forbidden: Admin access required' }
    }

    // 2. Parse & Validate Data
    // We expect formData to contain a JSON string for 'items' or handle it differently.
    // For complex forms with nested arrays, it's often easier to submit a JSON payload 
    // or parse structured formData. Here we'll assume the client sends structured data 
    // or we parse it. Let's assume the client sends individual fields and a JSON string for items.

    const rawData = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: Number(formData.get('price')),
        image_url: formData.get('image_url'),
        items: JSON.parse(formData.get('items') as string || '[]'),
    }

    const validatedFields = caseSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            error: 'Validation failed',
            errors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>,
        }
    }

    const { name, description, price, image_url, items } = validatedFields.data

    // 3. Database Transaction (Manual)
    // Supabase doesn't support multi-table transactions via JS client easily without RPC.
    // We will do it sequentially and attempt rollback if possible, or just rely on error handling.
    // Ideally, use an RPC function for atomicity. For now, sequential inserts.

    // Generate Slug
    const slug = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')

    // Insert Case
    const { data: newCase, error: caseError } = await supabase
        .from('cases')
        .insert({
            name,
            slug,
            description,
            price,
            image_url,
        })
        .select()
        .single()

    if (caseError) {
        if (caseError.code === '23505') {
            return { error: 'Ya existe una caja con este nombre. Por favor, elige otro.' }
        }
        return { error: `Failed to create case: ${caseError.message}` }
    }

    // Insert Items
    const itemsWithCaseId = items.map(item => ({
        case_id: newCase.id,
        name: item.name,
        value: item.value,
        image_url: item.image_url,
        probability: item.probability,
    }))

    const { error: itemsError } = await supabase
        .from('case_items')
        .insert(itemsWithCaseId)

    if (itemsError) {
        // Rollback: Delete the created case
        await supabase.from('cases').delete().eq('id', newCase.id)
        return { error: `Failed to create items: ${itemsError.message}` }
    }

    // Log Action
    await supabase.from('admin_logs').insert({
        admin_id: user.id,
        action: 'CREATE_CASE',
        details: { case_id: newCase.id, name: newCase.name },
    })

    revalidatePath('/cases')
    return { success: true }
}
