'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { signout } from '@/app/login/actions'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, User as UserIcon, Wallet, Box, Bell, History as HistoryIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Navbar({ user }: { user: User | null }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
    const [hasUnread, setHasUnread] = useState(true)

    // Mock balance for now, later fetch from DB
    const balance = 0.00

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <img src="/logo.png" alt="Cajas.app" className="h-8 w-auto" />
                    </Link>

                    {/* Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink href="/cases">Cases</NavLink>
                        <NavLink href="/ranking">Ranking</NavLink>
                        <NavLink href="/affiliates">Afiliados</NavLink>
                        <NavLink href="/daily-case">Caja diaria</NavLink>
                        <NavLink href="/wallet">Billetera</NavLink>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                {/* Notifications */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                        className="relative p-2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Bell className="w-5 h-5" />
                                        {hasUnread && (
                                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-background"></span>
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {isNotificationsOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-xl shadow-xl overflow-hidden z-50"
                                            >
                                                <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center">
                                                    <span className="text-sm font-medium text-white">Notificaciones</span>
                                                    <span
                                                        className="text-xs text-primary cursor-pointer hover:underline"
                                                        onClick={() => setHasUnread(false)}
                                                    >
                                                        Marcar leídas
                                                    </span>
                                                </div>
                                                <div className="max-h-[300px] overflow-y-auto">
                                                    <div className="p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                                                        <div className="flex items-start space-x-3">
                                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                                <Box className="w-4 h-4 text-primary" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-white font-medium">¡Bienvenido a Cajas.app!</p>
                                                                <p className="text-xs text-gray-400 mt-1">Gracias por unirte. Explora nuestras cajas y empieza a ganar.</p>
                                                                <p className="text-[10px] text-gray-500 mt-2">Hace 2 min</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Balance Display */}
                                <div className="hidden sm:flex items-center space-x-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
                                    <Wallet className="w-4 h-4 text-primary" />
                                    <span className="font-mono font-bold text-green-400">${balance.toFixed(2)}</span>
                                    <Link href="/wallet" className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs hover:bg-primary/80 transition-colors text-black font-bold">
                                        +
                                    </Link>
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
                                                className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-xl shadow-xl overflow-hidden"
                                            >
                                                <div className="px-4 py-3 border-b border-white/5">
                                                    <p className="text-sm text-white font-medium truncate">{user.user_metadata.full_name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                </div>
                                                <div className="py-1 border-b border-white/5">
                                                    <Link href="/wallet" className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white">
                                                        <Wallet className="w-4 h-4 mr-2" /> Billetera
                                                    </Link>
                                                    <Link href="/wallet" className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white">
                                                        <HistoryIcon className="w-4 h-4 mr-2" /> Historial
                                                    </Link>
                                                </div>
                                                <div className="py-1">
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
                                className="btn-primary px-5 py-2 rounded-lg font-bold flex items-center"
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
