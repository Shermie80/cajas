'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { signout } from '@/app/login/actions'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, User as UserIcon, Wallet, Box } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Navbar({ user }: { user: User | null }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // Mock balance for now, later fetch from DB
    const balance = 0.00

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.7)] transition-all">
                            <Box className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                            CAJAS<span className="text-primary">.APP</span>
                        </span>
                    </Link>

                    {/* Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink href="/cases">Cases</NavLink>
                        <NavLink href="/provably-fair">Provably Fair</NavLink>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                {/* Balance Display */}
                                <div className="hidden sm:flex items-center space-x-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
                                    <Wallet className="w-4 h-4 text-primary" />
                                    <span className="font-mono font-bold text-green-400">${balance.toFixed(2)}</span>
                                    <button className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs hover:bg-primary/80 transition-colors">+</button>
                                </div>

                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                                    >
                                        <img
                                            src={user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                                            alt="Avatar"
                                            className="w-9 h-9 rounded-full border-2 border-primary/50"
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {isMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 mt-2 w-48 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl overflow-hidden"
                                            >
                                                <div className="px-4 py-3 border-b border-white/5">
                                                    <p className="text-sm text-white font-medium truncate">{user.user_metadata.full_name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                </div>
                                                <div className="py-1">
                                                    <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white">
                                                        <UserIcon className="w-4 h-4 mr-2" /> Profile
                                                    </Link>
                                                    <form action={signout}>
                                                        <button className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-white/5 hover:text-red-300">
                                                            <LogOut className="w-4 h-4 mr-2" /> Sign Out
                                                        </button>
                                                    </form>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
    const pathname = usePathname()
    const isActive = pathname === href

    return (
        <Link
            href={href}
            className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive ? "text-primary neon-text" : "text-gray-400"
            )}
        >
            {children}
        </Link>
    )
}
