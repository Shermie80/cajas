import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { calculateRollResult, getWinningItem, generateServerSeed, generateClientSeed, hashSeed } from '@/lib/provably-fair'

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { caseId, clientSeed } = await request.json()

    // 1. Fetch Case and Items
    const { data: box } = await supabase.from('cases').select('*').eq('id', caseId).single()
    if (!box) return NextResponse.json({ error: 'Case not found' }, { status: 404 })

    const { data: caseItems } = await supabase
        .from('case_items')
        .select('*')
        .eq('case_id', caseId)

    if (!caseItems || caseItems.length === 0) {
        return NextResponse.json({ error: 'Case is empty' }, { status: 400 })
    }

    // 2. Fetch User Seeds
    let { data: seeds } = await supabase
        .from('user_seeds')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (!seeds) {
        // Should have been created by frontend or previous call, but auto-create if missing
        seeds = await createInitialSeeds(supabase, user.id)
    }

    // 3. Update Client Seed if provided
    if (clientSeed && clientSeed !== seeds.client_seed) {
        const { data: updated } = await supabase
            .from('user_seeds')
            .update({ client_seed: clientSeed })
            .eq('user_id', user.id)
            .select()
            .single()
        if (updated) seeds = updated
    }

    // 4. Calculate Winner Deterministically
    const nonce = seeds.nonce + 1
    const rollValue = calculateRollResult(seeds.server_seed, seeds.client_seed, nonce)

    // Map case items to structure expected by getWinningItem
    const mappedItems = caseItems.map((item: any) => {
        const probability = Number(item.probability)
        let rarity = 'common'
        if (probability < 1) rarity = 'legendary'
        else if (probability < 5) rarity = 'epic'
        else if (probability < 20) rarity = 'rare'

        return {
            ...item,
            price: item.value, // Map value to price if needed
            probability: probability,
            rarity: rarity
        }
    })

    const winnerItem = getWinningItem(mappedItems, rollValue) as any

    // 5. Update Nonce in DB
    await supabase
        .from('user_seeds')
        .update({ nonce: nonce })
        .eq('user_id', user.id)

    // 6. Record Game Roll (Audit)
    await supabase.from('game_rolls').insert({
        user_id: user.id,
        case_id: caseId,
        server_seed: seeds.server_seed, // We record the secret used! But user shouldn't see this table until they reveal? 
        // Actually, usually you store this effectively public but immutable. 
        // Or better, just store it. If user reveals later, they can check against this.
        client_seed: seeds.client_seed,
        nonce: nonce,
        roll_result: Math.floor(rollValue * 1000000), // Check precision
        item_won_id: winnerItem.id
    })

    // 7. Deduct Balance & Inventory (TODO: Existing logic placeholder)

    return NextResponse.json({
        winner: winnerItem,
        fairness: {
            server_seed_hash: hashSeed(seeds.server_seed),
            client_seed: seeds.client_seed,
            nonce: nonce,
            roll_value: rollValue
        }
    })
}

async function createInitialSeeds(supabase: any, userId: string) {
    const serverSeed = generateServerSeed()
    const clientSeed = generateClientSeed()
    const { data } = await supabase
        .from('user_seeds')
        .insert({
            user_id: userId,
            server_seed: serverSeed,
            client_seed: clientSeed,
            nonce: 0
        })
        .select()
        .single()
    return data
}
