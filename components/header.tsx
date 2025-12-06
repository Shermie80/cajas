'use client'

import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { Bell, Gift, MessageSquare, Wallet, History as HistoryIcon, Box } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LogOut, User as UserIcon, Settings } from 'lucide-react'
import { useModal } from '@/components/modal-provider'
import { signout } from '@/app/login/actions'

export default function Header({ user }: { user: User | null }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
    const [hasUnread, setHasUnread] = useState(true)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const notificationRef = useRef<HTMLDivElement>(null)
    const { openAuthModal } = useModal()

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-card border-b border-border z-30 flex items-center justify-end px-4 md:px-6 space-x-4 transition-all duration-300">

            {/* Balance & Deposit - Only for Logged In Users & Hidden on Mobile */}
            {user && (
                <div className="hidden md:flex items-center bg-black/20 dark:bg-black/40 rounded-lg p-1 border border-border">
                    <div className="flex items-center space-x-2 px-3">
                        <img src="https://flagcdn.com/w20/ar.png" alt="ARS" className="w-5 h-auto rounded-sm" />
                        <span className="font-mono font-bold text-sm">0,00 ARS</span>
                    </div>
                    <Link href="/wallet" className="bg-gradient-to-r from-primary to-[#9ce871] hover:bg-primary/90 text-primary-foreground font-bold text-sm px-4 py-1.5 rounded-md transition-colors flex items-center">
                        Depositar
                    </Link>
                </div>
            )}

            {/* Icons - Only for Logged In Users & Hidden on Mobile */}
            {user && (
                <div className="hidden md:flex items-center space-x-2">
                    <HeaderIcon icon={<Gift className="w-4 h-4" />} />
                    <HeaderIcon icon={<MessageSquare className="w-4 h-4" />} />

                    {/* Notifications */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors relative"
                        >
                            <Bell className="w-4 h-4" />
                            {hasUnread && (
                                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-[#1a1a2e]"></span>
                            )}
                        </button>

                        <AnimatePresence>
                            {isNotificationsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50"
                                >
                                    <div className="px-4 py-3 border-b border-border bg-muted/30 flex justify-between items-center">
                                        <span className="text-sm font-bold text-foreground">Notificaciones</span>
                                        <span
                                            className="text-xs text-primary cursor-pointer hover:underline"
                                            onClick={() => setHasUnread(false)}
                                        >
                                            Marcar leídas
                                        </span>
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto">
                                        <div className="p-4 hover:bg-muted/50 transition-colors border-b border-border last:border-0">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                    <Box className="w-4 h-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-foreground font-medium">¡Bienvenido a Cajas.app!</p>
                                                    <p className="text-xs text-muted-foreground mt-1">Gracias por unirte. Explora nuestras cajas y empieza a ganar.</p>
                                                    <p className="text-[10px] text-muted-foreground/70 mt-2">Hace 2 min</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* User Actions */}
            <div className="pl-2 border-border">
                {user ? (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center space-x-2 focus:outline-none transition-transform active:scale-95"
                        >
                            <img
                                src={user.user_metadata.avatar_url}
                                alt="User"
                                className="w-9 h-9 rounded-full border-2 border-primary/20 hover:border-primary transition-colors"
                            />
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50"
                                >
                                    <div className="p-4 border-b border-border bg-muted/30">
                                        <p className="text-sm font-bold text-foreground truncate">{user.user_metadata.full_name || 'Usuario'}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                    </div>

                                    <div className="p-2">
                                        <Link
                                            href="/profile"
                                            className="flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-lg transition-colors"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <UserIcon className="w-4 h-4" />
                                            <span>Mi Perfil</span>
                                        </Link>
                                        <Link
                                            href="/wallet"
                                            className="flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-lg transition-colors"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <Wallet className="w-4 h-4" />
                                            <span>Billetera</span>
                                        </Link>
                                        <Link
                                            href="/wallet"
                                            className="flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-lg transition-colors"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <HistoryIcon className="w-4 h-4" />
                                            <span>Historial</span>
                                        </Link>
                                    </div>

                                    <div className="p-2 border-t border-border">
                                        <form action={signout}>
                                            <button type="submit" className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                                                <LogOut className="w-4 h-4" />
                                                <span>Cerrar Sesión</span>
                                            </button>
                                        </form>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => openAuthModal('login')}
                            className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-white/5 cursor-pointer"
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            onClick={() => openAuthModal('signup')}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm px-4 py-2 rounded-lg transition-colors shadow-lg shadow-primary/20 cursor-pointer"
                        >
                            Registrarse
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}

function HeaderIcon({ icon }: { icon: React.ReactNode }) {
    return (
        <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors">
            {icon}
        </button>
    )
}
