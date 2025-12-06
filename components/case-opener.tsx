"use client"

import { useState, useRef, useEffect } from "react"
import { cn, formatCurrency } from "@/lib/utils"
import { ChevronUp, ChevronDown, X } from "lucide-react"

interface Item {
    id: string
    name: string
    image_url: string
    rarity: string
    price: number
    probability?: number
}

interface CaseOpenerProps {
    items: Item[]
    casePrice: number
    caseName: string
}

export default function CaseOpener({ items, casePrice, caseName }: CaseOpenerProps) {
    const [isSpinning, setIsSpinning] = useState(false)
    const [reel, setReel] = useState<Item[]>([])
    const [winner, setWinner] = useState<Item | null>(null)
    const [showWinnerModal, setShowWinnerModal] = useState(false)

    // Config
    const CARD_WIDTH = 180
    const GAP = 2 // Small gap for line separator
    const TOTAL_ITEM_WIDTH = CARD_WIDTH + GAP
    const SPIN_DURATION = 8000
    // We land on index 75. 
    const WINNER_INDEX = 75

    const reelContainerRef = useRef<HTMLDivElement>(null)
    const windowRef = useRef<HTMLDivElement>(null)

    // Helper to shuffle array
    const shuffle = (array: Item[]) => {
        let currentIndex = array.length, randomIndex;
        // While there remain elements to shuffle.
        while (currentIndex != 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    // Initialize static reel (pre-fill to look full)
    useEffect(() => {
        if (!items || items.length === 0) return

        // Create a random mix for the start
        const shuffled = shuffle([...items])
        // Fill enough to cover the window (e.g. 10 items)
        const initialReel = Array.from({ length: 4 }).flatMap(() => shuffled)
        setReel(initialReel.slice(0, 30))
    }, [items])

    // Calculate initial offset to center the "middle" of the initial reel
    // So users don't see empty space at start.
    // Let's center item at index 5.
    const START_INDEX = 5
    useEffect(() => {
        if (reelContainerRef.current && windowRef.current && !isSpinning && reel.length > 0) {
            const windowWidth = windowRef.current.clientWidth
            const centerOfWindow = windowWidth / 2

            // Center of item at START_INDEX
            const itemCenter = (START_INDEX * TOTAL_ITEM_WIDTH) + (CARD_WIDTH / 2)
            const params = centerOfWindow - itemCenter

            reelContainerRef.current.style.transition = 'none'
            reelContainerRef.current.style.transform = `translateX(${params}px)`
        }
    }, [reel, isSpinning])


    const startSpin = () => {
        if (isSpinning) return

        setIsSpinning(true)
        setShowWinnerModal(false)
        setWinner(null)

        // 1. Determine Winner 
        const wonItem = pickWeightedWinner(items)
        setWinner(wonItem)

        // 2. Build the Reel
        // We need the start to match what is currently visible so it doesn't jump
        // But since we are modifying the 'reel' state, React will re-render.
        // To make it smooth, we keep the first few items same as 'initialReel' if possible, 
        // OR we just accept a frame jump (usually imperceptible if we start at same offset).

        // Actually, easiest way is: Build a HUGE reel where the first N items match the current 'reel' state 
        // up to the point we need.
        // Let's just generate a fresh massive reel.
        const filler = shuffle([...items])
        const newReel: Item[] = []

        for (let i = 0; i < 110; i++) {
            if (i === WINNER_INDEX) {
                newReel.push(wonItem)
            } else {
                newReel.push(filler[i % filler.length])
            }
        }
        setReel(newReel)

        // 3. Animate
        setTimeout(() => {
            if (reelContainerRef.current && windowRef.current) {
                // Reset to start position (re-apply the start offset calculation)
                // We want to start from the *same visually aligned position*
                // If we assume we start at index 5:
                const windowWidth = windowRef.current.clientWidth

                // Force reset to start
                const startCenter = (START_INDEX * TOTAL_ITEM_WIDTH) + (CARD_WIDTH / 2)
                const startTranslate = (windowWidth / 2) - startCenter

                reelContainerRef.current.style.transition = 'none'
                reelContainerRef.current.style.transform = `translateX(${startTranslate}px)`

                // Force reflow
                reelContainerRef.current.getBoundingClientRect()

                // Calculate End position
                const winningCardCenter = (WINNER_INDEX * TOTAL_ITEM_WIDTH) + (CARD_WIDTH / 2)
                const finalTranslate = (windowWidth / 2) - winningCardCenter

                // Ease out cubic for realistic braking
                reelContainerRef.current.style.transition = `transform ${SPIN_DURATION}ms cubic-bezier(0.15, 0, 0.10, 1)`
                reelContainerRef.current.style.transform = `translateX(${finalTranslate}px)`
            }
        }, 50)

        // 4. End Spin
        setTimeout(() => {
            setIsSpinning(false)
            setShowWinnerModal(true)
        }, SPIN_DURATION + 500)
    }

    const pickWeightedWinner = (items: Item[]) => {
        if (!items || items.length === 0) return { id: "0", name: "Error", image_url: "", rarity: "common", price: 0 } as Item

        const totalWeight = items.reduce((acc, item) => acc + (item.probability || 0), 0)
        let random = Math.random() * totalWeight

        for (const item of items) {
            const weight = item.probability || 0
            if (random < weight) return item
            random -= weight
        }
        return items[items.length - 1]
    }

    const getRarityColor = (rarity: string) => {
        switch (rarity.toLowerCase()) {
            case 'legendary': return 'border-b-yellow-500'
            case 'epic': return 'border-b-purple-500'
            case 'rare': return 'border-b-blue-500'
            default: return 'border-b-white/20'
        }
    }

    return (
        <div className="w-full flex flex-col items-center gap-10">
            {/* SPINNER WINDOW */}
            <div className="relative w-full max-w-7xl mx-auto">

                {/* Neon Frame */}
                <div className="relative overflow-hidden bg-[#0A0A0A] rounded-xl border-2 border-[#1f2937] shadow-2xl h-[260px]">

                    {/* Top/Bottom Markers */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 filter drop-shadow-[0_0_8px_rgba(34,197,94,1)]">
                        <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-primary" />
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30 filter drop-shadow-[0_0_8px_rgba(34,197,94,1)]">
                        <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[16px] border-b-primary" />
                    </div>

                    {/* Center Line Verification */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-primary/30 -ml-px z-20 pointer-events-none" />

                    {/* Side Fades */}
                    <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#050505] to-transparent z-20 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none" />
                    {/* Scrolling Track */}
                    <div
                        ref={windowRef}
                        className="h-full flex items-center overflow-hidden"
                    >
                        <div
                            ref={reelContainerRef}
                            className="flex h-full items-center"
                            style={{
                                gap: GAP,
                                willChange: 'transform'
                            }}
                        >
                            {reel.map((item, index) => (
                                <div
                                    key={`${item.id}-${index}`}
                                    className={cn(
                                        "flex-shrink-0 relative w-[180px] h-full bg-[#121212] border-b-4",
                                        "flex flex-col items-center justify-center p-4",
                                        getRarityColor(item.rarity)
                                    )}
                                >
                                    <div className="flex-1 flex items-center justify-center w-full">
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-32 h-32 object-contain drop-shadow-xl"
                                        />
                                    </div>

                                    <div className="w-full text-center mt-2 space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate">
                                            PREMIO EFECTIVO
                                        </p>
                                        <p className="text-white font-bold text-lg tracking-wide">
                                            {formatCurrency(item.price)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Shadow/Glow under spinner */}
                <div className="absolute -bottom-10 inset-x-20 h-20 bg-primary/5 blur-[50px] rounded-full pointer-events-none" />
            </div>

            {/* ACTION BUTTON - REVERTED TO PREVIOUS STYLE */}
            <div className="flex flex-col items-center gap-4 z-20 relative">
                <button
                    onClick={startSpin}
                    disabled={isSpinning}
                    className={cn(
                        "group relative px-16 py-4 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer",
                        isSpinning ? "opacity-50 cursor-not-allowed grayscale" : "active:scale-95"
                    )}
                >
                    {/* Button Background & Effects */}
                    <div className="absolute inset-0 bg-[#0d1117] border border-primary/30 rounded-lg" />
                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-all" />

                    {/* Neon Lines */}
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                    <span className="relative z-10 text-primary font-bold text-lg tracking-[0.25em] uppercase drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                        {isSpinning ? "Abriendo..." : "Abrir Caja"}
                    </span>
                </button>
            </div>

            {/* WINNER MODAL */}
            {showWinnerModal && winner && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowWinnerModal(false)} />

                    <div className="relative w-full max-w-lg animate-in zoom-in-95 duration-500">
                        {/* Header */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

                        <div className="relative bg-[#0F0F0F] border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-8 flex flex-col items-center">
                            <div className="absolute top-4 right-4">
                                <button onClick={() => setShowWinnerModal(false)} className="text-gray-500 hover:text-white/80 cursor-pointer rounded-lg hover:bg-white/5 p-1.5 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <h2 className="text-2xl font-bold text-white uppercase tracking-widest mb-6 drop-shadow-md">
                                ¡PREMIO GANADO!
                            </h2>

                            <div className="relative">
                                {/* Glow */}
                                <div className={cn("absolute inset-0 rounded-full blur-3xl opacity-30",
                                    winner.rarity === 'legendary' ? 'bg-yellow-500' :
                                        winner.rarity === 'epic' ? 'bg-purple-500' : 'bg-blue-500'
                                )} />

                                <img
                                    src={winner.image_url}
                                    alt={winner.name}
                                    className="relative w-36 h-36 object-cover z-10 drop-shadow-2xl"
                                />
                            </div>

                            <div className="text-center mt-6 space-y-2">
                                <p className="text-gray-500 font-bold uppercase tracking-wider text-xs">
                                    {winner.name}
                                </p>
                                <p className="text-3xl font-mono text-primary font-bold">
                                    {formatCurrency(winner.price)}
                                </p>
                            </div>

                            <div className="w-full mt-8">
                                <button
                                    onClick={() => setShowWinnerModal(false)}
                                    className="w-full cursor-pointer bg-primary hover:bg-primary/90 text-black font-bold py-4 rounded-lg transition-colors uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                                >
                                    Recoger Premio
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
