"use client"

import { useState, useRef, useEffect } from "react"
import { cn, formatCurrency } from "@/lib/utils"
import { ChevronUp, ChevronDown, X, ArrowLeft, Volume2 } from "lucide-react"
import Link from "next/link"

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
    caseId: string
}

export default function CaseOpener({ items, casePrice, caseName, caseId }: CaseOpenerProps) {
    const [isSpinning, setIsSpinning] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [reel, setReel] = useState<Item[]>([])
    const [winner, setWinner] = useState<Item | null>(null)
    const [showWinnerModal, setShowWinnerModal] = useState(false)

    // Config cards
    const CARD_WIDTH = 180
    const GAP = 2
    const TOTAL_ITEM_WIDTH = CARD_WIDTH + GAP
    const SPIN_DURATION = 8000
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


    useEffect(() => {
        if (showWinnerModal && !isMuted) {
            const audio = new Audio('/fin.mp3')
            audio.play().catch(() => { })
        }
    }, [showWinnerModal, isMuted])

    const startSpin = async () => {
        if (isSpinning) return

        setIsSpinning(true)
        setShowWinnerModal(false)
        setWinner(null)

        try {
            // 1. Request Winner from Server (Provably Fair)
            const response = await fetch('/api/cases/open', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    caseId: caseId, // We need caseId prop or context. Currently prop 'caseName' is passed but id? 
                    // The component props need 'caseId'. 
                    // clientSeed: '...' // Optional: Allow user to set seed
                })
            })

            if (!response.ok) throw new Error('Failed to open case')

            const data = await response.json()
            const wonItem = data.winner

            setWinner(wonItem)

            // 2. Build the Reel around the Winner
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

                    // Sound Effect Logic
                    const audio = new Audio('/select.mp3')
                    audio.volume = 0.5

                    let lastIndex = -1
                    const startTime = Date.now()

                    const checkPosition = () => {
                        if (!reelContainerRef.current) return

                        const now = Date.now()
                        if (now - startTime > SPIN_DURATION) return

                        const style = window.getComputedStyle(reelContainerRef.current)
                        const matrix = new DOMMatrix(style.transform)
                        const currentX = matrix.m41

                        const windowWidth = windowRef.current?.clientWidth || 0
                        const centerOffset = windowWidth / 2

                        const rawIndex = (centerOffset - currentX - (CARD_WIDTH / 2)) / TOTAL_ITEM_WIDTH
                        const currentIndex = Math.round(rawIndex)

                        if (currentIndex !== lastIndex) {
                            if (!isMuted) {
                                const soundClone = audio.cloneNode() as HTMLAudioElement
                                soundClone.volume = 0.2
                                soundClone.play().catch(() => { })
                            }
                            lastIndex = currentIndex
                        }

                        requestAnimationFrame(checkPosition)
                    }

                    requestAnimationFrame(checkPosition)
                }
            }, 50)

            // 4. End Spin
            setTimeout(() => {
                setIsSpinning(false)
                setShowWinnerModal(true)
            }, SPIN_DURATION + 500)

        } catch (error) {
            console.error(error)
            setIsSpinning(false)
            alert("Error opening case")
        }
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
        <div className="w-full flex flex-col items-center gap-8">
            {/* HEADER */}
            <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-0">
                {/* Back Button */}
                <Link href="/" className="h-10 px-4 rounded-lg flex items-center justify-center gap-2 bg-[#202330] border border-[#2c303f] text-[#b1b6c6] hover:text-white transition-colors text-sm font-medium uppercase tracking-wider">
                    <ArrowLeft className="w-4 h-4" />
                    Atrás
                </Link>

                {/* Case Info */}
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold text-white uppercase tracking-wider">{caseName}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <img src="https://flagcdn.com/w20/ar.png" alt="ARS" className="w-4 h-auto rounded-[2px]" />
                        <span className="text-sm font-bold text-[#b1b6c6]">{formatCurrency(casePrice)}</span>
                    </div>
                </div>

                {/* Mute Button */}
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-10 h-10 rounded-lg cursor-pointer flex items-center justify-center bg-[#202330] border border-[#2c303f] text-[#b1b6c6] hover:text-white transition-colors"
                >
                    {isMuted ? <Volume2 className="w-5 h-5 text-red-500/50" /> : <Volume2 className="w-5 h-5" />}
                </button>
            </div>

            {/* SPINNER WINDOW */}
            <div className="relative w-full max-w-7xl mx-auto">

                {/* Neon Frame */}
                <div className="relative overflow-hidden bg-[#0A0A0A] border border-[#1f2937] shadow-2xl h-[260px]">

                    {/* Top/Bottom Markers */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 filter">
                        <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-primary" />
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 filter">
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
                        "group relative rounded-lg px-16 py-4 overflow-hidden transition-all duration-300 cursor-pointer",
                        isSpinning ? "opacity-50 cursor-not-allowed grayscale" : "active:scale-95"
                    )}
                >
                    {/* Button Background & Effects */}
                    <div className="absolute rounded-lg inset-0 bg-gradient-to-b from-[#ffc44f] to-[#ffa900] border border-[#ffc44f]/50" />
                    <div className="absolute rounded-lg inset-0 bg-secondary/10 group-hover:bg-secondary/20 transition-all" />

                    {/* Neon Lines */}
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                    <span className="relative z-10 text-black font-bold text-base tracking-[0.25em] uppercase">
                        {isSpinning ? "Abriendo..." : "Abrir Caja"}
                    </span>
                </button>
            </div>

            {/* WINNER MODAL */}
            {showWinnerModal && winner && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowWinnerModal(false)} />

                    <div className="relative w-full max-w-md animate-in zoom-in-95 duration-500">
                        <div className="relative bg-[#1a1d26]/70 border border-white/5 rounded-2xl overflow-hidden shadow-2xl p-8 flex flex-col items-center gap-6">

                            {/* Close Button with Ghost Effect */}
                            <button
                                onClick={() => setShowWinnerModal(false)}
                                className="absolute top-4 right-4 text-gray-500 rounded-lg hover:text-white hover:bg-secondary/25 transition-colors p-2 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Rarity Glow Background */}
                            <div className={cn("absolute inset-0 opacity-20 bg-gradient-to-b from-transparent to-transparent pointer-events-none",
                                winner.rarity === 'legendary' ? 'via-yellow-500/20' :
                                    winner.rarity === 'epic' ? 'via-purple-500/20' :
                                        winner.rarity === 'rare' ? 'via-blue-500/20' : 'via-gray-500/20'
                            )} />

                            <div className="text-center space-y-1 z-10 pt-4">
                                <h2 className="text-3xl font-bold uppercase tracking-wider text-white drop-shadow-md">
                                    ¡FELICIDADES!
                                </h2>
                                <p className="text-gray-400 text-sm font-medium">Has ganado un nuevo objeto</p>
                            </div>

                            <div className="relative group z-10 my-4">
                                <div className={cn("absolute inset-0 rounded-full blur-2xl opacity-40 transition-all duration-500 group-hover:opacity-60",
                                    winner.rarity === 'legendary' ? 'bg-yellow-500' :
                                        winner.rarity === 'epic' ? 'bg-purple-500' :
                                            winner.rarity === 'rare' ? 'bg-blue-500' : 'bg-gray-500'
                                )} />
                                <img
                                    src={winner.image_url}
                                    alt={winner.name}
                                    className="relative w-48 h-48 object-contain drop-shadow-2xl transform transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>

                            <div className="text-center space-y-2 z-10">
                                <div className={cn("inline-block px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest mb-1",
                                    winner.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                        winner.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                            winner.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                                'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                )}>
                                    {winner.rarity}
                                </div>
                                <h3 className="text-xl font-bold text-white max-w-[280px] break-words leading-tight mt-2 mx-auto">
                                    {winner.name}
                                </h3>
                                <p className="text-2xl font-mono text-primary font-bold">
                                    {formatCurrency(winner.price)}
                                </p>
                            </div>

                            <button
                                onClick={() => setShowWinnerModal(false)}
                                className="w-full btn-primary cursor-pointer py-3 rounded-xl text-black font-bold uppercase tracking-wider text-sm shadow-lg z-10 mt-2 hover:brightness-110 active:scale-[0.98] transition-all"
                            >
                                Vender por {formatCurrency(winner.price)}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
