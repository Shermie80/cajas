import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import CaseBrowser from '@/components/case-browser'

export default async function Home() {
  const supabase = await createClient()
  const { data: cases } = await supabase.from('cases').select('*')

  return (
    <div className="space-y-12">
      {/* Banner Section */}
      <div className="w-full h-[260px] border border-white/5 relative rounded-xl overflow-hidden shadow-2xl shadow-primary/5">
        {/* Background Image */}
        <div
          className="absolute inset-0  bg-right bg-no-repeat"
          style={{ backgroundImage: 'url("/banner.png")' }}
        />

        {/* Overlay Gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#212431] to-transparent" />

        {/* Content Container - Left Aligned */}
        <div className="absolute inset-0 flex items-center px-8 md:px-12">
          <div className="max-w-lg space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
              Abri tu <span className="text-primary">suerte</span>
            </h1>
            <p className="text-gray-300 text-base font-medium leading-relaxed drop-shadow-md">
              Descubre las mejores cajas con premios exclusivos.
              <br />¡Empieza a ganar hoy mismo!
            </p>
            <div className="pt-2">
              <Link
                href="/wallet"
                className="inline-flex border border-yellow-400 items-center justify-center px-8 py-2 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-0.5"
              >
                Cargar saldo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Cases Container */}
      <div>
        <CaseBrowser initialCases={cases} />
      </div>
    </div>
  )
}
