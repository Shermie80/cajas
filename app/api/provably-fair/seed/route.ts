import { createClient } from '@/lib/supabase/server'
import { generateServerSeed, generateClientSeed, hashSeed } from '@/lib/provably-fair'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let { data: seeds } = await supabase
        .from('user_seeds')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (!seeds) {
        // Create initial seeds if not exist
        const serverSeed = generateServerSeed()
        const clientSeed = generateClientSeed()
        const nonce = 0

        const { data: newSeeds, error } = await supabase
            .from('user_seeds')
            .insert({
                user_id: user.id,
                server_seed: serverSeed,
                client_seed: clientSeed,
                nonce: nonce
            })
            .select()
            .single()

        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        seeds = newSeeds
    }

    // Return the Public information only
    return NextResponse.json({
        server_seed_hash: hashSeed(seeds.server_seed),
        client_seed: seeds.client_seed,
        nonce: seeds.nonce
    })
}

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { client_seed } = await request.json()

    // Rotate server seed and update client seed
    const newServerSeed = generateServerSeed()

    // reset nonce? Standard practice varies. Usually resetting nonce when server seed changes is good.
    // Or just updating client seed keeps nonce? 
    // Let's reset nonce on Server Seed rotation.

    // If user provided a specific client seed, use it, otherwise generate new or keep?
    // Let's say this endpoint rotates everything.

    const newClientSeed = client_seed || generateClientSeed()

    const { data: seeds, error } = await supabase
        .from('user_seeds')
        .update({
            server_seed: newServerSeed,
            client_seed: newClientSeed,
            nonce: 0,
            updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({
        server_seed_hash: hashSeed(seeds.server_seed),
        client_seed: seeds.client_seed,
        nonce: seeds.nonce
    })
}
