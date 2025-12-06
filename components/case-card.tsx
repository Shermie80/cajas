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
            <div className="relative w-full flex flex-col items-center justify-center overflow-visible transition-all duration-300 group-hover:-translate-y-[2px]">

                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square bg-primary/10 blur-[40px] sm:blur-[60px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-all" />

                {/* Price Tag - Top Right with Blur */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-6 z-20">
                    <div className="relative leading-none tracking-wider overflow-hidden rounded-lg border border-white/10 bg-black/70 backdrop-blur-md px-1.5 sm:px-2 truncate">
                        <span className="text-primary font-bold font-mono text-xs sm:text-sm">
                            ${price}
                        </span>
                    </div>
                </div>

                {/* Image */}
                <div className="relative z-10 p-1 w-full flex justify-center">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-auto max-w-[160px] sm:max-w-[270px] object-contain drop-shadow-2xl rounded-xl"
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
