import Link from 'next/link'
import { ArrowLeft, Mail, MessageSquare, Send } from 'lucide-react'

export default function ContactPage() {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Contacto</h1>
                <p className="text-gray-400">Estamos aquí para ayudarte. Ponte en contacto con nosotros.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Email Support */}
                <div className="bg-card border border-white/5 rounded-2xl p-8 text-center transition-colors group">
                    <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-full mb-6 group-hover:scale-110 transition-transform">
                        <Mail className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Soporte por Email</h3>
                    <p className="text-gray-400 text-sm mb-6">
                        Para consultas generales, problemas con pagos o soporte técnico.
                    </p>
                    <a href="mailto:soporte@cajas.club" className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
                        soporte@cajas.club
                    </a>
                </div>

                {/* Discord Support */}
                <div className="bg-card border border-white/5 rounded-2xl p-8 text-center transition-colors group">
                    <div className="inline-flex items-center justify-center p-4 bg-[#5865F2]/10 rounded-full mb-6 group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-8 h-8 text-[#5865F2]" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Comunidad en Discord</h3>
                    <p className="text-gray-400 text-sm mb-6">
                        Únete a nuestro servidor para ayuda en tiempo real, sorteos y chat con la comunidad.
                    </p>
                    <a href="#" className="inline-block px-6 py-2 bg-[#5865F2] hover:bg-[#4752c4] text-white rounded-lg transition-colors font-medium">
                        Unirse a Discord
                    </a>
                </div>
            </div>

            {/* Form Section */}
            <div className="bg-card border border-white/5 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Send className="w-5 h-5 text-primary" />
                    Envíanos un mensaje
                </h3>

                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Nombre</label>
                            <input
                                type="text"
                                placeholder="Tu nombre"
                                className="w-full bg-[#1a1d26] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Email</label>
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                className="w-full bg-[#1a1d26] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Mensaje</label>
                        <textarea
                            rows={4}
                            placeholder="¿En qué podemos ayudarte?"
                            className="w-full bg-[#1a1d26] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                        />
                    </div>

                    <button type="button" className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-4 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                        Enviar Mensaje
                    </button>
                </form>
            </div>
        </div>
    )
}
