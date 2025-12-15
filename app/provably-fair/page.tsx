import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Lock, User, Dna, Eye } from 'lucide-react'

export default function ProvablyFairPage() {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">

            {/* Header */}
            <div className="flex flex-col items-center text-center space-y-6 mb-20">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                    <ShieldCheck className="relative w-24 h-24 text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)] mb-4" />
                </div>

                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase italic leading-tight">
                    Juego <span className="text-primary">Limpio</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
                    No necesitas confiar en nosotros. <br />
                    <span className="text-white font-bold">Las matemáticas no mienten.</span>
                </p>
            </div>

            {/* The Analogy Section - For Normals */}
            <div className="space-y-16 mb-24">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold text-white mb-4">¿Cómo funciona? (Explicación Simple)</h2>
                    <p className="text-gray-400">
                        Imagina que vamos a jugar a los dados, pero quieres estar seguro de que no están trucados.
                        Así es como lo garantizamos:
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Lines for Desktop */}
                    <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent dashed-line" />

                    {/* Step 1 */}
                    <div className="relative bg-card p-8 rounded-3xl flex flex-col items-center text-center group z-10">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                            <Lock className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">1. El Sobre Cerrado</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Antes de que juegues, nosotros generamos el resultado y lo metemos en un &quot;sobre cerrado digital&quot; (Hashes). Te damos este sobre cerrado antes de tu tirada. No podemos cambiar lo que hay dentro una vez que lo tienes.
                        </p>
                        <div className="mt-4 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20 text-xs font-mono text-blue-300">
                            Server Seed
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative bg-card p-8 rounded-3xl flex flex-col items-center text-center group z-10">
                        <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 border border-green-500/20 group-hover:rotate-12 transition-transform duration-300">
                            <User className="w-8 h-8 text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">2. Tu Corte</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Es tu turno. Tú aportas un número aleatorio o frase (Client Seed) que actúa como cuando &quot;cortas la baraja&quot;. Esto asegura que el resultado final depende de ti y que nosotros no podemos predecirlo.
                        </p>
                        <div className="mt-4 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20 text-xs font-mono text-green-300">
                            Client Seed
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative bg-card p-8 rounded-3xl flex flex-col items-center text-center group z-10">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                            <Dna className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">3. El Resultado</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Combinamos nuestro sobre cerrado con tu corte para generar el resultado final. Matemáticamente, es imposible que sepamos qué saldrá hasta que tú hagas tu &quot;corte&quot;.
                        </p>
                        <div className="mt-4 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 text-xs font-mono text-primary">
                            Nonce + Hash
                        </div>
                    </div>
                </div>
            </div>

            {/* Technical Section */}
            <div className="mt-32 border-t border-white/5 pt-16">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-white/5 rounded-xl">
                        <Eye className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Para los Curiosos (Detalles Técnicos)</h2>
                        <p className="text-gray-500 text-sm">Así es como lo hacemos realmente.</p>
                    </div>
                </div>

                <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden font-mono text-sm">
                    <div className="border-b border-white/10 bg-white/5 px-6 py-3 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        <span className="ml-2 text-gray-500 text-xs">logica.js</span>
                    </div>
                    <div className="p-6 md:p-8 space-y-2 overflow-x-auto">
                        <p className="text-gray-500">{'// Usamos el estándar de la industria HMAC-SHA256'}</p>
                        <p className="text-purple-400">const <span className="text-blue-400">crypto</span> = <span className="text-yellow-300">require</span>{'(\'crypto\')'};</p>
                        <br />
                        <p className="text-purple-400">function <span className="text-yellow-300">calculateResult</span>{'(serverSeed, clientSeed, nonce) {'}</p>
                        <p className="pl-4 text-gray-500">{'// 1. Combinamos los seeds y el nonce'}</p>
                        <p className="pl-4 text-purple-400">const <span className="text-blue-400">input</span> = <span className="text-green-300">{"`${clientSeed}-${nonce}`"}</span>;</p>
                        <br />
                        <p className="pl-4 text-gray-500">{'// 2. Generamos el hash HMAC'}</p>
                        <p className="pl-4 text-purple-400">const <span className="text-blue-400">hash</span> = <span className="text-blue-400">crypto</span></p>
                        <p className="pl-8 text-blue-400">.createHmac(<span className="text-green-300">{'\'sha256\''}</span>, serverSeed)</p>
                        <p className="pl-8 text-blue-400">.update(input)</p>
                        <p className="pl-8 text-blue-400">.digest(<span className="text-green-300">{'\'hex\''}</span>);</p>
                        <br />
                        <p className="pl-4 text-gray-500">{'// 3. Convertimos los primeros 8 caracteres a un número'}</p>
                        <p className="pl-4 text-purple-400">const <span className="text-blue-400">decimal</span> = <span className="text-yellow-300">parseInt</span>(hash.<span className="text-yellow-300">substring</span>(0, 8), 16);</p>
                        <br />
                        <p className="pl-4 text-gray-500">{'// 4. Obtenemos un porcentaje entre 0 y 1'}</p>
                        <p className="pl-4 text-purple-400">const <span className="text-blue-400">rollResult</span> = decimal / 0xffffffff;</p>
                        <br />
                        <p className="pl-4 text-purple-400">return <span className="text-blue-400">rollResult</span>; <span className="text-gray-500">{'// 0.4812...'}</span></p>
                        <p className="text-purple-400">{'}'}</p>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                        <h4 className="text-white font-bold mb-2">Verifícalo tú mismo</h4>
                        <p className="text-sm text-gray-400">
                            Próximamente tendrás un botón en tu historial para copiar estos datos y pegarlos en cualquier verificador de HMAC-SHA256 online independiente.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                        <h4 className="text-white font-bold mb-2">Aleatoriedad Real</h4>
                        <p className="text-sm text-gray-400">
                            Incluso si supiéramos tu Client Seed, no podemos cambiar el Server Seed porque ya te hemos dado su &quot;Hash&quot; (la huella digital) de antemano.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
