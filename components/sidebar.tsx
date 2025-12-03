'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    Menu,
    Headphones,
    Gift,
    Moon,
    Sun,
    Handshake,
    X
} from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '@/components/theme-provider'
import { motion, AnimatePresence } from 'framer-motion'

export default function Sidebar() {
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()
    const [isOpen, setIsOpen] = useState(false)

    const toggleSidebar = () => setIsOpen(!isOpen)

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-50 p-2 bg-card border border-border rounded-lg md:hidden"
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
                "fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border flex flex-col z-50 transition-transform duration-300 ease-in-out md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-border">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                            <Gift className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">CAJAS</span>
                    </div>
                    {/* Mobile Close Button */}
                    <button onClick={toggleSidebar} className="md:hidden p-1 text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Mobile Header Elements */}
                <div className="md:hidden px-4 py-4 border-b border-border space-y-4">
                    {/* Balance & Deposit */}
                    <div className="bg-muted/30 rounded-lg p-3 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <img src="https://flagcdn.com/w20/ar.png" alt="ARS" className="w-5 h-auto rounded-sm" />
                                <span className="font-mono font-bold text-sm">0,00 ARS</span>
                            </div>
                        </div>
                        <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm py-2 rounded-md transition-colors">
                            Depositar
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                    <SidebarLink href="/" icon={<Gift className="w-5 h-5" />}>
                        Inicio
                    </SidebarLink>
                    <SidebarLink href="/cases" icon={<Gift className="w-5 h-5" />}>
                        Cajas
                    </SidebarLink>
                    <SidebarLink href="/sponsorships" icon={<Handshake className="w-5 h-5" />}>
                        Patrocinios
                    </SidebarLink>

                    <SidebarLink href="/support" icon={<Headphones className="w-5 h-5" />}>
                        Soporte en vivo
                    </SidebarLink>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-border mt-auto">
                    <div className="flex items-center justify-between bg-muted/50 rounded-full p-1">
                        <button
                            onClick={() => setTheme('dark')}
                            className={cn(
                                "flex-1 flex items-center justify-center space-x-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all",
                                theme === 'dark' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Moon className="w-3 h-3" />
                            <span>Oscuro</span>
                        </button>
                        <button
                            onClick={() => setTheme('light')}
                            className={cn(
                                "flex-1 flex items-center justify-center space-x-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all",
                                theme === 'light' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Sun className="w-3 h-3" />
                            <span>Claro</span>
                        </button>
                    </div>
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
