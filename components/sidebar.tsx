'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    Menu,
    Headphones,
    Gift,
    Handshake,
    X,
    Home,
    Trophy,
    LifeBuoy
} from 'lucide-react'
import { useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import { User } from '@supabase/supabase-js'

export default function Sidebar({ user }: { user: User | null }) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    const toggleSidebar = () => setIsOpen(!isOpen)

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-[100] p-2 bg-card border border-border rounded-lg md:hidden"
            >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Overlay for mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleSidebar}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Content */}
            <aside className={cn(
                "fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border flex flex-col z-[99] transition-transform duration-300 ease-in-out md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-border">
                    <div className="flex items-center">
                        <img src="/logo.png" alt="Cajas.app" className="h-8 w-auto" />
                    </div>
                    {/* Mobile Close Button */}
                    <button onClick={toggleSidebar} className="md:hidden p-1 text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Mobile Header Elements */}
                <div className="md:hidden px-4 py-4 border-b border-border space-y-4">
                    {/* Balance & Deposit */}
                    {user && (
                        <div className="bg-muted/30 rounded-lg p-3 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <img src="https://flagcdn.com/w20/ar.png" alt="ARS" className="w-5 h-auto rounded-sm" />
                                    <span className="font-mono font-bold text-sm">0,00 ARS</span>
                                </div>
                            </div>
                            <button className="w-full btn-primary text-sm py-2 rounded-md transition-colors font-bold">
                                Depositar
                            </button>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                    <SidebarLink href="/" icon={<Home className="w-5 h-5" />}>
                        Inicio
                    </SidebarLink>
                    <SidebarLink href="/cases" icon={<Gift className="w-5 h-5" />}>
                        Sorteos
                    </SidebarLink>
                    <SidebarLink href="/ranking" icon={<Trophy className="w-5 h-5" />}>
                        Ranking
                    </SidebarLink>
                    <SidebarLink href="/affiliates" icon={<Handshake className="w-5 h-5" />}>
                        Afiliados
                    </SidebarLink>
                    <SidebarLink href="/daily-case" icon={<Gift className="w-5 h-5" />}>
                        Caja diaria
                    </SidebarLink>
                    <SidebarLink href="/support" icon={<LifeBuoy className="w-5 h-5" />}>
                        Centro de ayuda
                    </SidebarLink>
                </div>

                {/* Footer Actions */}
                <div className="p-4 mt-auto space-y-4">
                    {/* Stats Section Removed */}
                </div>
            </aside>
        </>
    )
}

function SidebarLink({ href, icon, children }: { href: string, icon: React.ReactNode, children: React.ReactNode }) {
    const pathname = usePathname()
    const isActive = pathname === href

    return (
        <Link
            href={href}
            className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group",
                isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
        >
            <span className={cn("group-hover:text-primary transition-colors", isActive && "text-primary")}>
                {icon}
            </span>
            <span className="font-medium text-sm">{children}</span>
        </Link>
    )
}

