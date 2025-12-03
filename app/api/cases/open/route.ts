import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { caseId } = await request.json()

    // 1. Fetch Case and Items
    const { data: box } = await supabase.from('cases').select('*').eq('id', caseId).single()
    if (!box) return NextResponse.json({ error: 'Case not found' }, { status: 404 })

    const { data: caseItems } = await supabase
        .from('case_items')
        .select('drop_chance, items(*)')
        .eq('case_id', caseId)

    if (!caseItems || caseItems.length === 0) {
        return NextResponse.json({ error: 'Case is empty' }, { status: 400 })
    }

    // 2. Check Balance (TODO: Implement real balance check)
    // const { data: profile } = await supabase.from('users').select('balance').eq('id', user.id).single()
    // if (profile.balance < box.price) return NextResponse.json({ error: 'Insufficient funds' }, { status: 402 })

    // 3. Determine Winner (Weighted Random)
    // Total weight should be 100, but we normalize just in case
    const totalWeight = caseItems.reduce((sum, item) => sum + Number(item.drop_chance), 0)
    let random = Math.random() * totalWeight

    let winnerItem = null
    for (const item of caseItems) {
        if (random < item.drop_chance) {
            winnerItem = item.items
            break
        }
        random -= item.drop_chance
    }

    if (!winnerItem) {
        // Fallback to last item if rounding errors
        winnerItem = caseItems[caseItems.length - 1].items
    }

    // 4. Deduct Balance & Record Transaction (TODO)

    // 5. Add to Inventory (TODO)

    return NextResponse.json({
        winner: winnerItem,
        // In a real provably fair system, we would return the nonce, client_seed, and server_seed_hash here
    })
}
