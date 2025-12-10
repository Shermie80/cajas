'use client'

import { useState, useEffect, useRef } from 'react'
import { User, Mail, Phone, MapPin, CreditCard, Camera, Save, ArrowDownLeft, ArrowUpRight, Clock, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { resizeImage } from '@/lib/image-utils'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const supabase = createClient()

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        dni: '',
        phone: '',
        address: '',
        avatarUrl: ''
    })

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/')
                return
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (profile) {
                setFormData({
                    fullName: profile.full_name || '',
                    email: user.email || '',
                    dni: profile.dni || '',
                    phone: profile.phone || '',
                    address: profile.address || '',
                    avatarUrl: profile.avatar_url || user.user_metadata.avatar_url || ''
                })
            } else {
                // If no profile exists yet, use auth metadata
                setFormData(prev => ({
                    ...prev,
                    email: user.email || '',
                    fullName: user.user_metadata.full_name || '',
                    avatarUrl: user.user_metadata.avatar_url || ''
                }))
            }
        }
        loadProfile()
    }, [router, supabase])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user found')

            const updates = {
                id: user.id,
                full_name: formData.fullName,
                dni: formData.dni,
                phone: formData.phone,
                address: formData.address,
                updated_at: new Date().toISOString(),
            }

            const { error } = await supabase
                .from('profiles')
                .upsert(updates)

            if (error) throw error

            // Update auth metadata as well to keep sync
            await supabase.auth.updateUser({
                data: { full_name: formData.fullName }
            })

            setMessage({ type: 'success', text: 'Profile updated successfully!' })
            router.refresh()
        } catch (error) {
            console.error('Error updating profile:', error)
            setMessage({ type: 'error', text: 'Failed to update profile.' })
        } finally {
            setIsLoading(false)
        }
    }

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return
        }

        const file = e.target.files[0]
        setIsUploading(true)
        setMessage(null)

        try {
            // Resize image to max 200x200
            const resizedBlob = await resizeImage(file, 200, 200)
            const resizedFile = new File([resizedBlob], file.name, { type: file.type })

            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user found')

            const fileExt = file.name.split('.').pop()
            const filePath = `${user.id}/avatar.${fileExt}`

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, resizedFile, { upsert: true })

            if (uploadError) throw uploadError

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            const publicUrlWithTimestamp = `${publicUrl}?t=${Date.now()}`

            // Update profile with new avatar URL
            const { error: updateError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    avatar_url: publicUrlWithTimestamp,
                    updated_at: new Date().toISOString(),
                })

            if (updateError) throw updateError

            // Update auth metadata
            await supabase.auth.updateUser({
                data: { avatar_url: publicUrlWithTimestamp }
            })

            setFormData(prev => ({ ...prev, avatarUrl: publicUrlWithTimestamp }))
            setMessage({ type: 'success', text: 'Avatar updated successfully!' })
            router.refresh()
        } catch (error) {
            console.error('Error uploading avatar:', error)
            setMessage({ type: 'error', text: 'Failed to upload avatar.' })
        } finally {
            setIsUploading(false)
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-3xl mx-auto">
                    {/* Profile Settings */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-card border border-border rounded-2xl p-8 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-foreground mb-2">Configuración del perfil</h1>
                                <p className="text-muted-foreground text-sm">Administrar la información de su cuenta</p>
                            </div>
                            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                                <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden relative">
                                    {formData.avatarUrl ? (
                                        <img src={formData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-10 h-10 text-primary" />
                                    )}
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-6 h-6 text-white" />
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleAvatarChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {message && (
                            <div className={cn(
                                "mb-6 p-4 rounded-lg text-sm font-medium",
                                message.type === 'success' ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                            )}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Full Name */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className="w-full bg-muted/50 mt-1 border border-input rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                {/* DNI */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">DNI</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            value={formData.dni}
                                            onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                                            className="w-full bg-muted/50 border border-input mt-1 rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                                            placeholder="12.345.678"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Número de teléfono</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-muted/50 border border-input mt-1 rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                                            placeholder="+54 9 11 1234-5678"
                                        />
                                    </div>
                                </div>

                                {/* Email (Read Only) */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Correo electrónico</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            readOnly
                                            className="w-full bg-muted/30 border border-input mt-1 rounded-lg py-2.5 pl-10 pr-4 text-muted-foreground cursor-not-allowed text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Dirección de envío</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full bg-muted/50 border border-input rounded-lg mt-1 py-2.5 pl-10 pr-4 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[100px] resize-none text-sm"
                                        placeholder="Street, Number, City, Province, Zip Code"
                                    />
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex items-center cursor-pointer space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    {isLoading ? (
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            <span>Guardar Cambios</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>

                </div>
            </div>
        </div>
    )
}
