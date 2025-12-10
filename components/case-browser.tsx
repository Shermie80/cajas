"use client"

import { useState, useMemo, useRef, useEffect } from 'react'
import CaseCard from '@/components/case-card'
import { Search, ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Case {
    id: number
    created_at: string
    name: string
    slug: string
    image_url: string
    price: number
}

interface CaseBrowserProps {
    initialCases: Case[] | null
}

const PRICE_RANGES = [
    { label: "Cualquier precio", min: 0, max: Infinity },
    { label: "$0 - $10,000", min: 0, max: 10000 },
    { label: "$10,000 - $25,000", min: 10000, max: 25000 },
    { label: "$25,000 - $50,000", min: 25000, max: 50000 },
    { label: "$50,000 - $75,000", min: 50000, max: 75000 },
    { label: "$75,000 - $100,000", min: 75000, max: 100000 },
]

const SORT_OPTIONS = [
    { label: "Más Nuevos", value: 'newest' },
    { label: "Menor Precio", value: 'asc' },
    { label: "Mayor Precio", value: 'desc' },
]

export default function CaseBrowser({ initialCases }: CaseBrowserProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedRange, setSelectedRange] = useState(PRICE_RANGES[0])
    const [sortOrder, setSortOrder] = useState(SORT_OPTIONS[0])

    // Filter and Sort Logic
    const filteredCases = useMemo(() => {
        if (!initialCases) return []

        return initialCases
            .filter(c => {
                // Text Search
                const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase())

                // Price Range
                const price = Number(c.price)
                const matchesPrice = price >= selectedRange.min && price <= selectedRange.max

                return matchesSearch && matchesPrice
            })
            .sort((a, b) => {
                if (sortOrder.value === 'asc') return a.price - b.price
                if (sortOrder.value === 'desc') return b.price - a.price
                // Default to newest
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            })
    }, [initialCases, searchTerm, selectedRange, sortOrder])

    return (
        <div>
            {/* Filter Bar */}
            <div className="relative z-40 bg-[#1a1d26] border border-white/5 p-4 rounded-xl mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">

                {/* Find by Name */}
                <div className="relative w-full lg:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar caja..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-white placeholder-gray-500 transition-all hover:bg-black/30"
                    />
                </div>

                {/* Filters Group */}
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-center">

                    {/* Price Range Dropdown */}
                    <CustomSelect
                        options={PRICE_RANGES}
                        value={selectedRange}
                        onChange={setSelectedRange}
                        label="Precio"
                    />

                    {/* Sort Dropdown */}
                    <CustomSelect
                        options={SORT_OPTIONS}
                        value={sortOrder}
                        onChange={setSortOrder}
                        label="Ordenar"
                    />

                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                {filteredCases.map((box) => (
                    <CaseCard
                        key={box.id}
                        id={String(box.id)}
                        name={box.name}
                        slug={box.slug}
                        price={box.price}
                        image={box.image_url || '/asset_iPhone.png'}
                    />
                ))}

                {filteredCases.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-500 italic">
                        No se encontraron cajas con estos filtros.
                    </div>
                )}
            </div>
        </div>
    )
}

function CustomSelect({ options, value, onChange, label }: { options: any[], value: any, onChange: (val: any) => void, label: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative w-full sm:w-64" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-sm text-white transition-all hover:bg-black/30 hover:border-white/20",
                    isOpen && "border-primary/50 bg-black/40 ring-1 ring-primary/20"
                )}
            >
                <div className="flex flex-col items-start gap-0.5">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wide font-bold">{label}</span>
                    <span className="font-medium truncate">{value.label}</span>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1f232e] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="py-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                        {options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    onChange(option)
                                    setIsOpen(false)
                                }}
                                className={cn(
                                    "w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-white/5 transition-colors",
                                    value.label === option.label ? "text-primary bg-primary/5" : "text-gray-300"
                                )}
                            >
                                {option.label}
                                {value.label === option.label && <Check className="w-3 h-3" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
