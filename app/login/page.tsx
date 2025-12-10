'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        const action = isLogin ? login : signup
        const result = await action(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md glass rounded-2xl p-8 shadow-2xl relative overflow-hidden"
            >
                {/* Background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/30 blur-[50px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-center mb-2 neon-text">
                        {isLogin ? 'Welcome Back' : 'Join the Action'}
                    </h1>
                    <p className="text-muted-foreground text-center mb-8">
                        {isLogin ? 'Sign in to access your inventory' : 'Create an account to start opening cases'}
                    </p>

                    <form action={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <input
                                    name="fullName"
                                    type="text"
                                    required
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="input-primary"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="input-primary"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3 rounded-lg flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm text-muted-foreground hover:text-white transition-colors"
                        >
                            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
