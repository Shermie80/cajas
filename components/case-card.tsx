import Link from 'next/link'
import { cn } from '@/lib/utils'

interface CaseCardProps {
    id: string
    name: string
    slug: string
    price: number
    image: string
}

export default function CaseCard({ id, name, slug, price, image }: CaseCardProps) {
    return (
        <Link
            href={`/cases/${slug}`}
            className="group relative flex flex-col items-center"
        >
            {/* Card Container */}
            <div className="relative w-fit flex flex-col items-center justify-center overflow-visible transition-all duration-300 group-hover:-translate-y-[2px]">

                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-all" />

                {/* Price Tag - Top Right with Blur */}
                <div className="absolute top-4 right-4 z-20">
                    <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black/70 backdrop-blur-md px-2">
                        <span className="text-primary font-bold font-mono text-sm">
                            ${price}
                        </span>
                    </div>
                </div>

                {/* Image */}
                <div className="relative z-10 p-1">
                    <img
                        src="/img_caja.png"
                        alt={name}
                        className="w-auto h-auto max-w-[270px] object-contain drop-shadow-2xl rounded-xl"
                    />
                </div>

                {/* Title - Bottom Center */}
                <div className="absolute bottom-6 z-20 flex justify-center w-full px-4">
                    <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black/70 backdrop-blur-md px-3 py-1">
                        <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-primary transition-colors drop-shadow-md">
                            {name}
                        </h3>
                    </div>
                </div>

            </div>
        </Link>
    )
}
