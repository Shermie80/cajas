import { createClient } from '@/lib/supabase/server'
import CaseCard from '@/components/case-card'

export default async function Home() {
  const supabase = await createClient()
  const { data: cases } = await supabase.from('cases').select('*')

  return (
    <div className="space-y-12">
      {/* Banner Section */}
      <div className="w-full h-64 bg-[#1a1a1a] rounded-2xl flex items-center justify-center border border-white/5 shadow-lg relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        <h1 className="text-4xl font-bold tracking-widest text-white/20 group-hover:text-white/40 transition-colors">BANNER</h1>
      </div>

      {/* Cases Container */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center uppercase tracking-wider text-white/80">Contenedor Cajas</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
          {cases?.map((box) => (
            <CaseCard
              key={box.id}
              id={box.id}
              name={box.name}
              slug={box.slug}
              price={box.price}
              image={box.image_url || '/asset_iPhone.png'}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
