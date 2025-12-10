import Link from 'next/link'
import { Box, Twitter, Instagram, Disc as Discord } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-muted border-t border-white/5 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <img src="/logo.png" alt="Cajas.app" className="h-8 w-auto" />
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            El destino premium para abrir cajas y ganar skins. Seguro y Provably Fair.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-bold mb-4">Plataforma</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contacto</Link></li>
                            <li><Link href="/provably-fair" className="hover:text-primary transition-colors">Provably Fair</Link></li>
                            <li><Link href="/top-drops" className="hover:text-primary transition-colors">Mejores Drops</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4">Soporte</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/faq" className="hover:text-primary transition-colors">Preguntas Frecuentes</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Términos de Servicio</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Política de Privacidad</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="font-bold mb-4">Comunidad</h3>
                        <div className="flex space-x-4">
                            {/* Twitter (X) */}
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#1a1d26] text-muted-foreground hover:text-white hover:bg-[#1f1f2f] transition-all duration-300 group">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            {/* Instagram */}
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#1a1d26] text-muted-foreground hover:text-white hover:bg-[#1f1f2f] transition-all duration-300 group">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.451 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <div>
                        {new Date().getFullYear()} Cajas.club &copy; Reservados todos los derechos.
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center p-1 bg-red-600/10 border border-red-600/40 rounded text-red-600/80 font-bold text-[10px]">
                            +18
                        </div>
                        <span>Al acceder a este sitio, usted confirma que es mayor de 18 años.</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
