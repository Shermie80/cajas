import Link from 'next/link'
import { Box, Twitter, Instagram, Disc as Discord } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-[#1e2121] border-t border-[#2e3030] py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <img src="/logo.png" alt="Cajas.app" className="h-8 w-auto" />
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            The premium destination for case openings and skin trading. Provably fair and secure.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-bold mb-4">Platform</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/cases" className="hover:text-primary transition-colors">Cases</Link></li>
                            <li><Link href="/provably-fair" className="hover:text-primary transition-colors">Provably Fair</Link></li>
                            <li><Link href="/top-drops" className="hover:text-primary transition-colors">Top Drops</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="font-bold mb-4">Community</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-white hover:bg-white/10 transition-all duration-300 group">
                                <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-white hover:bg-white/10 transition-all duration-300 group">
                                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-white hover:bg-white/10 transition-all duration-300 group">
                                <Discord className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <div>
                        {new Date().getFullYear()} Cajas.club. &copy; Reservados todos los derechos.
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
