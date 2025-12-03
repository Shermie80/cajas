'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, Loader2 } from 'lucide-react'
import { useModal } from '@/components/modal-provider'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AuthModal() {
    const { isAuthModalOpen, closeAuthModal, authView, setAuthView } = useModal()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    if (!isAuthModalOpen) return null

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const fullName = formData.get('fullName') as string

        try {
            if (authView === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
                        },
                    },
                })
                if (error) throw error
                closeAuthModal()
                router.refresh()
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                closeAuthModal()
                router.refresh()
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    async function handleGoogleLogin() {
        setIsLoading(true)
        setError(null)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            if (error) throw error
        } catch (err: any) {
            setError(err.message)
            setIsLoading(false)
        }
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeAuthModal}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Close Button */}
                    <button
                        onClick={closeAuthModal}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {authView === 'login' ? 'Bienvenido de nuevo' : 'Crear cuenta'}
                            </h2>
                            <p className="text-gray-400 text-sm">
                                {authView === 'login'
                                    ? 'Ingresa tus credenciales para continuar'
                                    : 'Únete a la mejor comunidad de cajas'}
                            </p>
                        </div>

                        {/* Google Login */}
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full bg-white text-black font-bold py-3 rounded-lg transition-all transform active:scale-95 hover:bg-gray-100 flex items-center justify-center space-x-2 mb-6 cursor-pointer"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            <span>Continuar con Google</span>
                        </button>

                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-[#1a1a1a] text-gray-500">O continúa con email</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {authView === 'signup' && (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Nombre Completo</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            name="fullName"
                                            type="text"
                                            required
                                            placeholder="Tu nombre"
                                            className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="tu@email.com"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Contraseña</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-3 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    authView === 'login' ? 'Iniciar Sesión' : 'Registrarse'
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-400">
                                {authView === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                                <button
                                    onClick={() => setAuthView(authView === 'login' ? 'signup' : 'login')}
                                    className="ml-2 text-primary hover:underline font-bold cursor-pointer"
                                >
                                    {authView === 'login' ? 'Regístrate' : 'Inicia Sesión'}
                                </button>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
