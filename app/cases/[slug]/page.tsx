import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CaseOpener from '@/components/case-opener'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function CaseDetailPage({ params }: { params: { slug: string } }) {
    const supabase = await createClient()

    // Fetch case
    const { data: box } = await supabase
        .from('cases')
        .select('*')
        .eq('slug', params.slug)
        .single()

    if (!box) {
        notFound()
    }

    // Fetch items in this case
    const { data: caseItems } = await supabase
        .from('case_items')
        .select(`
      drop_chance,
      items (
        id,
        name,
        image_url,
        rarity,
        price
      )
    `)
        .eq('case_id', box.id)

    // Flatten the structure
    const items = caseItems?.map((ci: any) => ({
        ...ci.items,
        drop_chance: ci.drop_chance
    })) || []

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="bg-[#1a1a2e]/50 border-b border-white/5 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/cases" className="inline-flex items-center text-muted-foreground hover:text-white mb-4 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cases
                    </Link>
                    <div className="flex items-center space-x-6">
                        <img src={box.image_url} alt={box.name} className="w-24 h-24 object-contain drop-shadow-lg" />
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">{box.name}</h1>
                            <p className="text-muted-foreground max-w-2xl">{box.description}</p>
                        </div>
                        <div className="ml-auto text-right">
                            <p className="text-sm text-muted-foreground">Price</p>
                            <p className="text-3xl font-mono font-bold text-green-400">${box.price}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Opener Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <CaseOpener items={items} casePrice={box.price} />
            </div>

            {/* Case Contents */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold mb-6">Case Contents</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {items.map((item: any) => (
                        <div key={item.id} className="bg-[#1a1a2e] border border-white/5 rounded-lg p-4 flex flex-col items-center hover:border-white/20 transition-colors group">
                            <div className="relative w-full aspect-square mb-2">
                                <img src={item.image_url} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                            </div>
                            <p className="font-medium text-sm text-center truncate w-full">{item.name}</p>
                            <div className="flex items-center justify-between w-full mt-2 text-xs text-muted-foreground">
                                <span>{item.drop_chance}%</span>
                                <span className="text-green-400">${item.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
