
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import CaseOpener from "@/components/case-opener"
import CaseContents from "@/components/case-contents"
import { formatCurrency } from "@/lib/utils"

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                    }
                },
            },
        }
    )

    // 1. Fetch Case Details
    const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .select('*')
        .eq('slug', slug)
        .single()

    if (caseError || !caseData) {
        console.error("Error fetching case:", caseError)
        notFound()
    }


    // 2. Fetch Case Items (Directly from case_items table, no pivot/join needed as per new schema)
    const { data: caseItemsData, error: itemsError } = await supabase
        .from('case_items')
        .select('*')
        .eq('case_id', caseData.id)

    if (itemsError) {
        console.error("Error fetching case items:", itemsError)
        return <div className="p-20 text-center text-red-500">Error loading case contents</div>
    }

    if (!caseItemsData || caseItemsData.length === 0) {
        return (
            <main className="min-h-screen pt-24 pb-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">{caseData.name}</h1>
                    <p className="text-gray-500">Esta caja no tiene items asignados todavía.</p>
                </div>
            </main>
        )
    }

    // 3. Map Data to Item Interface
    // Schema has: name, value, image_url, probability. Missing: rarity.
    // We infer rarity based on probability.
    const items = caseItemsData.map((item: any) => {
        let rarity = 'common'
        if (item.probability < 1) rarity = 'legendary'
        else if (item.probability < 5) rarity = 'epic'
        else if (item.probability < 20) rarity = 'rare'

        return {
            id: item.id,
            name: item.name,
            image_url: item.image_url,
            price: item.value, // mapped from value
            probability: item.probability,
            rarity: rarity
        }
    })

    return (
        <main className="min-h-screen pt-24 pb-20">
            <div className="container mx-auto px-4">

                {/* Header Info */}
                <div className="text-center mb-8 space-y-2">
                    <h1 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-widest drop-shadow-lg">
                        {caseData.name}
                    </h1>
                    <p className="text-primary font-mono text-xl md:text-2xl font-bold bg-primary/10 inline-block px-6 py-2 rounded-full border border-primary/20 backdrop-blur-sm">
                        {formatCurrency(caseData.price)}
                    </p>
                </div>

                {/* Opener Component */}
                <CaseOpener
                    items={items}
                    casePrice={caseData.price}
                    caseName={caseData.name}
                />

                {/* Contents Grid */}
                <CaseContents items={items} />

            </div>
        </main>
    )
}
