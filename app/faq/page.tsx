import Link from 'next/link'
import { ArrowLeft, HelpCircle } from 'lucide-react'

export default function FAQPage() {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-white mb-4">Preguntas Frecuentes</h1>
                <p className="text-gray-400">Todo lo que necesitas saber sobre Cajas.club</p>
            </div>

            <div className="space-y-8">
                {/* Section 1 */}
                <div className="bg-[#1a1d26] border border-white/5 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-primary" />
                        ¿Qué es Cajas.club?
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                        Cajas.club es una plataforma premium de apertura de cajas misteriosas. Puedes adquirir cajas con diferentes temáticas y precios para obtener ítems virtuales o premios en efectivo que se añaden instantáneamente a tu balance.
                    </p>
                </div>

                {/* Section 2 */}
                <div className="bg-[#1a1d26] border border-white/5 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-primary" />
                        ¿Es justo el sistema? (Provably Fair)
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                        Absolutamente. Utilizamos un sistema <strong>Provably Fair</strong> (Matemáticamente Justo) verificado criptográficamente. Esto significa que el resultado de cada apertura se decide antes de que empiece la animación y no puede ser manipulado ni por nosotros ni por ti. <Link href="/provably-fair" className="text-primary hover:underline">Leer más.</Link>
                    </p>
                </div>

                {/* Section 3 */}
                <div className="bg-[#1a1d26] border border-white/5 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-primary" />
                        ¿Cómo deposito dinero?
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                        Aceptamos varios métodos de pago incluyendo criptomonedas y tarjetas locales. Dirígete a tu <Link href="/wallet" className="text-primary hover:underline">Billetera</Link> y selecciona "Cargar Saldo" para ver las opciones disponibles en tu región.
                    </p>
                </div>

                {/* Section 4 */}
                <div className="bg-[#1a1d26] border border-white/5 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-primary" />
                        ¿Puedo retirar mis ganancias?
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                        Sí. Los ítems que ganas se convierten instantáneamente a su valor en efectivo en tu balance. Puedes solicitar un retiro de tu balance a tu cuenta bancaria o billetera cripto una vez que hayas alcanzado el monto mínimo de retiro.
                    </p>
                </div>
            </div>
        </div>
    )
}
