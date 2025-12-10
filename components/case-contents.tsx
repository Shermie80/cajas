
import { formatCurrency, cn } from "@/lib/utils"

interface Item {
    id: string
    name: string
    image_url: string
    rarity: string
    price: number
    probability?: number
}

interface CaseContentsProps {
    items: Item[]
}

export default function CaseContents({ items }: CaseContentsProps) {
    const getRarityColor = (rarity: string) => {
        switch (rarity.toLowerCase()) {
            case 'legendary': return 'border-b-yellow-500 shadow-yellow-500/10'
            case 'epic': return 'border-b-purple-500 shadow-purple-500/10'
            case 'rare': return 'border-b-blue-500 shadow-blue-500/10'
            default: return 'border-b-gray-600 shadow-gray-500/10'
        }
    }

    const getRarityText = (rarity: string) => {
        switch (rarity.toLowerCase()) {
            case 'legendary': return 'text-yellow-500'
            case 'epic': return 'text-purple-500'
            case 'rare': return 'text-blue-500'
            default: return 'text-gray-400'
        }
    }

    return (
        <div className="w-full max-w-7xl mx-auto mt-16 mb-20 px-4">
            <div className="text-center mb-8">
                <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase">
                    CONTENIDOS DE LAS CAJAS
                </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1">
                {items.sort((a, b) => (b.price - a.price)).map((item) => (
                    <div
                        key={item.id}
                        className={cn(
                            "group relative rounded-t-lg flex flex-col justify-between bg-[#15171e] overflow-hidden border border-transparent border-b",
                            getRarityColor(item.rarity)
                        )}
                    >
                        {/* Probability Top Right */}
                        <div className="absolute top-3 right-3 text-right z-10">
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">PROBABILIDAD</p>
                            <p className="text-[10px] font-mono font-bold text-gray-300">
                                {item.probability ? `${item.probability.toFixed(3)}%` : '??%'}
                            </p>
                        </div>

                        {/* Image */}
                        <div className="w-full aspect-[4/3] flex items-end justify-center pb-2 mt-4 relative">
                            {/* Background Glow */}
                            <div className={cn("absolute bottom-0 w-2/3 h-2/3 rounded-full blur-[40px] opacity-20 group-hover:opacity-30 transition-opacity",
                                item.rarity === 'legendary' ? 'bg-yellow-500' :
                                    item.rarity === 'epic' ? 'bg-purple-500' :
                                        'bg-blue-500'
                            )} />
                            <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-3/4 h-3/4 object-contain drop-shadow-xl z-10"
                            />
                        </div>

                        {/* Bottom Info */}
                        <div className="px-4 pb-4">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate mb-0.5">
                                {item.name}
                            </p>
                            <p className="text-lg font-bold text-white">
                                {formatCurrency(item.price)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
