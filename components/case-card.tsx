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
            <div className="relative w-full aspect-[3/4] bg-[#0f0f13] rounded-[2rem] border border-primary/20 p-6 flex flex-col items-center justify-between overflow-hidden transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_-5px_rgba(var(--primary),0.3)]">

                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none group-hover:bg-primary/30 transition-all" />

                {/* Image */}
                <div className="relative z-10 w-full flex-1 flex items-center justify-center">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-auto object-contain transform group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl"
                    />
                </div>

                {/* Title */}
                <div className="relative z-10 mt-4 text-center">
                    <h3 className="text-xl font-bold text-white tracking-wide group-hover:text-primary transition-colors">
                        {name}
                    </h3>
                </div>

                {/* Price Tag */}
                <div className="relative z-10 mt-4 bg-[#1a1a20] border border-white/5 px-6 py-2 rounded-full">
                    <span className="text-primary font-bold font-mono text-lg">
                        ${price}
                    </span>
                </div>

            </div>

            {/* Outer Border Effect (Optional, simulated with box-shadow above) */}
        </Link>
    )
}
