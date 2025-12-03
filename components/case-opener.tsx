'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useAnimation, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

type Item = {
    id: string
    name: string
    image_url: string
    rarity: string
}

export default function CaseOpener({ items, casePrice }: { items: Item[], casePrice: number }) {
    const [isSpinning, setIsSpinning] = useState(false)
    const [winner, setWinner] = useState<Item | null>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const controls = useAnimation()

    // Generate a long list of items for the roulette (repeating the items)
    // We need enough items to scroll for a few seconds
    const rouletteItems = Array.from({ length: 100 }).map((_, i) => {
        return items[i % items.length]
    })

    const CARD_WIDTH = 200
    const GAP = 16
    const VISIBLE_ITEMS = 5

    async function handleOpen() {
        if (isSpinning) return
        setIsSpinning(true)
        setWinner(null)

        // 1. Call API to get result (Mock for now)
        // In real app: const { result } = await openCase(caseId)
        const randomWinnerIndex = Math.floor(Math.random() * items.length)
        const winningItem = items[randomWinnerIndex]

        // 2. Calculate stop position
        // We want to land on the winner, which we place near the end of the list
        const LANDING_INDEX = 75 // Land on the 75th item (arbitrary, far enough to scroll)

        // Replace the item at LANDING_INDEX with the actual winner
        rouletteItems[LANDING_INDEX] = winningItem

        // Center of the container
        // Offset = (Index * (Width + Gap)) - (ContainerWidth / 2) + (CardWidth / 2)
        // We add some random jitter within the card to make it look natural
        const jitter = (Math.random() - 0.5) * (CARD_WIDTH * 0.8)
        const targetX = -(LANDING_INDEX * (CARD_WIDTH + GAP)) + jitter

        // 3. Animate
        await controls.start({
            x: targetX,
            transition: {
                duration: 5,
                ease: [0.1, 0.8, 0.2, 1], // Cubic-bezier for "spin" feel (fast start, slow stop)
            }
        })

        setWinner(winningItem)
        setIsSpinning(false)
    }

    function getRarityColor(rarity: string) {
        switch (rarity) {
            case 'legendary': return 'border-yellow-500 shadow-yellow-500/50'
            case 'epic': return 'border-purple-500 shadow-purple-500/50'
            case 'rare': return 'border-blue-500 shadow-blue-500/50'
            default: return 'border-gray-500 shadow-gray-500/50'
        }
    }

    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* Roulette Window */}
            <div className="relative w-full h-64 bg-black/50 rounded-xl overflow-hidden border-2 border-primary/30 mb-8 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                {/* Center Line */}
                <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-yellow-400 z-20 shadow-[0_0_10px_rgba(250,204,21,0.8)]" />

                {/* Items Track */}
                <motion.div
                    animate={controls}
                    initial={{ x: 0 }}
                    className="absolute top-0 bottom-0 flex items-center pl-[calc(50%-100px)]" // Start centered on first item
                    style={{ gap: GAP }}
                >
                    {rouletteItems.map((item, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex-shrink-0 w-[200px] h-[200px] bg-[#1a1a2e] rounded-lg border-2 flex flex-col items-center justify-center p-4 relative",
                                getRarityColor(item.rarity)
                            )}
                        >
                            <img src={item.image_url} alt={item.name} className="w-32 h-32 object-contain mb-2 drop-shadow-lg" />
                            <p className="text-sm font-bold text-center truncate w-full">{item.name}</p>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
                        </div>
                    ))}
                </motion.div>

                {/* Overlays for depth */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center justify-center space-y-4">
                {winner && !isSpinning && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center mb-4"
                    >
                        <p className="text-xl text-muted-foreground">You won:</p>
                        <h2 className="text-3xl font-bold neon-text">{winner.name}</h2>
                    </motion.div>
                )}

                <button
                    onClick={handleOpen}
                    disabled={isSpinning}
                    className="px-12 py-4 bg-primary hover:bg-primary/90 text-white text-xl font-bold rounded-full shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSpinning ? 'Opening...' : `Open Case ($${casePrice})`}
                </button>
            </div>
        </div>
    )
}
