'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ModalContextType {
    isAuthModalOpen: boolean
    openAuthModal: (view?: 'login' | 'signup') => void
    closeAuthModal: () => void
    authView: 'login' | 'signup'
    setAuthView: (view: 'login' | 'signup') => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [authView, setAuthView] = useState<'login' | 'signup'>('login')

    const openAuthModal = (view: 'login' | 'signup' = 'login') => {
        setAuthView(view)
        setIsAuthModalOpen(true)
    }

    const closeAuthModal = () => {
        setIsAuthModalOpen(false)
    }

    return (
        <ModalContext.Provider value={{ isAuthModalOpen, openAuthModal, closeAuthModal, authView, setAuthView }}>
            {children}
        </ModalContext.Provider>
    )
}

export function useModal() {
    const context = useContext(ModalContext)
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider')
    }
    return context
}
