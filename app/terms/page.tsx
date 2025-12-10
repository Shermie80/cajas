import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Términos de Servicio</h1>
                <p className="text-gray-400">Última actualización: 10 de Diciembre, 2025</p>
            </div>

            <div className="space-y-8 text-gray-300 leading-relaxed">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">1. Aceptación de los Términos</h2>
                    <p>
                        Al acceder y utilizar Cajas.club, usted acepta estar legalmente vinculado por estos términos. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">2. Elegibilidad (+18)</h2>
                    <p>
                        Usted debe tener al menos 18 años de edad (o la mayoría de edad legal en su jurisdicción) para utilizar este servicio. Al registrarse, usted confirma que cumple con este requisito. Nos reservamos el derecho de solicitar verificación de identidad (KYC) en cualquier momento.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">3. Cuantas de Usuario</h2>
                    <p>
                        Usted es responsable de mantener la confidencialidad de su cuenta y contraseña. Cajas.club no se hace responsable de pérdidas causadas por el acceso no autorizado a su cuenta. Está prohibido tener múltiples cuentas para abusar de bonos o promociones.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">4. Ítems Virtuales y Valor</h2>
                    <p>
                        Los "Ítems" obtenidos en las cajas son bienes virtuales que representan un valor dentro de la plataforma. Cajas.club se reserva el derecho de ajustar los precios de las cajas y las probabilidades de drop en cualquier momento, aunque esto no afectará a las cajas ya abiertas.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">5. Conducta Prohibida</h2>
                    <p>
                        Está estrictamente prohibido el uso de bots, scripts automáticos (scrapers), o cualquier intento de manipular el sistema "Provably Fair". El incumplimiento resultará en la suspensión permanente de la cuenta y la confiscación del saldo.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">6. Limitación de Responsabilidad</h2>
                    <p>
                        El servicio se proporciona "tal cual". Cajas.club no garantiza que el servicio sea ininterrumpido o libre de errores. No somos responsables de pérdidas financieras derivadas del juego o interrupciones del servicio.
                    </p>
                </section>
            </div>

            <div className="mt-12">
                <Link href="/" className="text-muted-foreground hover:text-white transition-colors inline-flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Volver al inicio
                </Link>
            </div>
        </div>
    )
}
