import Link from 'next/link'
import { Box, Twitter, Instagram, Disc as Discord } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-card border-t border-border py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <Box className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">
                                CAJAS<span className="text-primary">.APP</span>
                            </span>
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
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Discord className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border text-center text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} Cajas.app. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
