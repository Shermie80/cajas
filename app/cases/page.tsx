import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Box } from 'lucide-react'

export default async function CasesPage() {
    const supabase = await createClient()
    const { data: cases } = await supabase.from('cases').select('*')

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 neon-text">Available Cases</h1>
                <p className="text-muted-foreground">Choose a case to open and win exclusive skins.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {cases?.map((box) => (
                    <Link
                        key={box.id}
                        href={`/cases/${box.slug}`}
                        className="group relative bg-[#1a1a2e] border border-white/5 rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                    >
                        <div className="aspect-square p-8 flex items-center justify-center bg-gradient-to-b from-transparent to-black/50">
                            <img
                                src={box.image_url || 'https://via.placeholder.com/200'}
                                alt={box.name}
                                className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                            />
                        </div>

                        <div className="p-4 border-t border-white/5 bg-white/5 backdrop-blur-sm">
                            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{box.name}</h3>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Price</span>
                                <span className="font-mono font-bold text-green-400">${box.price}</span>
                            </div>
                        </div>

                        {/* Hover Glow */}
                        <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 rounded-xl transition-all pointer-events-none" />
                    </Link>
                ))}
            </div>
        </div>
    )
}
