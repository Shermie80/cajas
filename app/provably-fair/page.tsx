import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Lock, RefreshCw, Calculator } from 'lucide-react'

export default function ProvablyFairPage() {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">

            {/* Header */}
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4 group hover:bg-primary/20 transition-all duration-500">
                    <ShieldCheck className="w-12 h-12 text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white uppercase italic">
                    Sistema <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 pr-2">Provably Fair</span>
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl">
                    En Cajas.club, la transparencia no es una opción, es nuestra base.
                    Utilizamos criptografía avanzada para garantizar que cada tirada sea justa,
                    impredecible y verificable.
                </p>
            </div>

            {/* Core Concepts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="bg-[#1a1d26] border border-white/5 p-6 rounded-2xl hover:border-primary/30 transition-all group">
                    <Lock className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-white mb-2">Server Seed</h3>
                    <p className="text-sm text-gray-400">
                        Una clave secreta generada por nuestro servidor. Se te muestra en forma encriptada (Hash) antes de que juegues, garantizando que no podemos cambiarla después de tu apuesta.
                    </p>
                </div>
                <div className="bg-[#1a1d26] border border-white/5 p-6 rounded-2xl hover:border-primary/30 transition-all group">
                    <RefreshCw className="w-8 h-8 text-green-400 mb-4 group-hover:spin-slow transition-transform" />
                    <h3 className="text-xl font-bold text-white mb-2">Client Seed</h3>
                    <p className="text-sm text-gray-400">
                        Una clave que tú controlas. Puedes cambiarla en cualquier momento para influir en el resultado aleatorio, asegurando que nosotros no controlamos tu suerte.
                    </p>
                </div>
                <div className="bg-[#1a1d26] border border-white/5 p-6 rounded-2xl hover:border-primary/30 transition-all group">
                    <Calculator className="w-8 h-8 text-yellow-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-white mb-2">Nonce</h3>
                    <p className="text-sm text-gray-400">
                        Un contador que aumenta en 1 con cada tirada que haces. Asegura que cada resultado sea único incluso si mantienes las mismas semillas.
                    </p>
                </div>
            </div>

            {/* Technical Explanation */}
            <div className="bg-[#13151b] border border-white/5 rounded-3xl p-8 md:p-12 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                <div>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-1 h-8 bg-primary rounded-full" />
                        ¿Cómo se calcula el resultado?
                    </h2>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                        El ganador no es elegido por una "ruleta" animada, sino por una fórmula matemática estricta ejecutada en milisegundos antes de que veas la animación. Usamos el estándar de la industria <strong>HMAC-SHA256</strong>.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="bg-black/40 rounded-xl p-4 font-mono text-sm border border-white/10 overflow-x-auto">
                        <p className="text-white mt-1">
                            <span className="text-blue-400">const</span> hash = <span className="text-yellow-400">HMAC_SHA256</span>(serverSeed, clientSeed + <span className="text-green-400">"-"</span> + nonce);
                        </p>
                        <p className="text-white mt-1">
                            <span className="text-blue-400">const</span> roll = <span className="text-yellow-400">parseInt</span>(hash.<span className="text-yellow-400">substring</span>(0, 8), 16) / <span className="text-orange-400">0xFFFFFFFF</span>;
                        </p>
                    </div>
                </div>

                <div className="text-sm text-gray-400">
                    <strong className="text-gray-300">En resumen:</strong> Combinamos tu semilla, nuestra semilla y el número de tirada para generar un hash único. Tomamos los primeros 8 caracteres de ese hash y los convertimos en un número entre 0 y 1. Ese número determina en qué ítem cae la "aguja".
                </div>
            </div>

            {/* FAQ */}
            <div className="mt-16 space-y-8">
                <h2 className="text-3xl font-bold text-white text-center">Preguntas Frecuentes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h4 className="text-white font-bold">¿Puedo verificar mis tiradas?</h4>
                        <p className="text-gray-400 text-sm">
                            Sí. Al rotar tu Server Seed (próximamente disponible en tu perfil), se te revelará la semilla anterior. Puedes usar cualquier verificador HMAC de terceros con tus datos para comprobar que el resultado fue legítimo.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-white font-bold">¿Pueden manipular mi suerte?</h4>
                        <p className="text-gray-400 text-sm">
                            Imposible. Como no conocemos tu Client Seed (que puedes cambiar) de antemano, y tú no conoces nuestro Server Seed (que está comprometido por el Hash), ninguna parte puede alterar el resultado a su favor.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
