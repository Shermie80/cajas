import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Política de Privacidad</h1>
                <p className="text-gray-400">Nos tomamos en serio tu privacidad.</p>
            </div>

            <div className="space-y-8 text-gray-300 leading-relaxed">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">1. Información que Recopilamos</h2>
                    <p>
                        Recopilamos información básica necesaria para el funcionamiento del servicio, incluyendo: información de perfil proporcionada por Google (si usa inicio de sesión social), dirección IP, historial de transacciones y registros de actividad del juego (para auditoría Provably Fair).
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">2. Uso de la Información</h2>
                    <p> Utilizamos sus datos para:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Proveer y mantener el servicio.</li>
                        <li>Procesar transacciones de depósito y retiro.</li>
                        <li>Detectar y prevenir el fraude.</li>
                        <li>Cumplir con obligaciones legales.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">3. Cookies y Almacenamiento Local</h2>
                    <p>
                        Utilizamos cookies y almacenamiento local para mantener su sesión iniciada y recordar sus preferencias (como el tema oscuro/claro o el estado del sonido). No utilizamos cookies de terceros para rastreo publicitario invasivo.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">4. Compartir Datos</h2>
                    <p>
                        No vendemos su información personal a terceros. Solo compartimos datos con proveedores de servicios esenciales (como procesadores de pago) bajo estrictos acuerdos de confidencialidad, o cuando lo requiere la ley.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">5. Seguridad</h2>
                    <p>
                        Implementamos medidas de seguridad estándar de la industria, incluyendo encriptación SSL y protección de bases de datos. Sin embargo, ningún método de transmisión por Internet es 100% seguro.
                    </p>
                </section>
            </div>
        </div>
    )
}
