'use client'

import { useState } from 'react'
import { Wallet, ArrowDownLeft, ArrowUpRight, History, ChevronDown, Gift, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function WalletPage() {
    const [activeTab, setActiveTab] = useState('depositar')
    const [amount, setAmount] = useState('')
    const [depositAmount, setDepositAmount] = useState('7000')
    const [paymentMethod, setPaymentMethod] = useState('pago_movil')

    // Mock data
    const balance = 0.00
    const minAmount = 10253.00

    const handlePercentageClick = (percentage: number) => {
        if (balance > 0) {
            setAmount((balance * percentage).toFixed(2))
        }
    }

    const tabs = [
        { id: 'saldo', label: 'Saldo', icon: Wallet },
        { id: 'depositar', label: 'Depositar', icon: ArrowDownLeft },
        { id: 'retirar', label: 'Retirar', icon: ArrowUpRight },
        { id: 'historial', label: 'Historial', icon: History },
    ]

    const depositPresets = ['7000', '15000', '150000', '1500000']

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-foreground mb-8 uppercase tracking-wider">Billetera</h1>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
                    {/* Sidebar Navigation - Sticky */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-2">
                            <div className="bg-card/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-lg">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "w-full flex items-center space-x-3 px-6 py-4 text-sm font-medium transition-all relative overflow-hidden group",
                                            activeTab === tab.id
                                                ? "text-primary bg-primary/5"
                                                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                        )}
                                    >
                                        {activeTab === tab.id && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(253,176,34,0.5)]"
                                            />
                                        )}
                                        <tab.icon className={cn("w-5 h-5 transition-colors", activeTab === tab.id ? "text-primary" : "group-hover:text-foreground")} />
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="bg-card/50 backdrop-blur-md border border-white/5 rounded-2xl p-8 shadow-xl"
                        >
                            {activeTab === 'depositar' && (
                                <div className="space-y-6 max-w-2xl">
                                    {/* Currency Selector */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Moneda del depósito</label>
                                        <div className="relative group">
                                            <button className="w-full btn-secondary rounded-xl px-4 py-3 flex items-center justify-between text-foreground hover:border-primary/50 transition-all duration-300">
                                                <div className="flex items-center space-x-3">
                                                    <img src="https://flagcdn.com/w40/ar.png" alt="ARS" className="w-6 h-4 rounded-sm shadow-sm" />
                                                    <span className="font-bold tracking-wide">ARS</span>
                                                </div>
                                                <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Bonus Banner */}
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center space-x-3 text-yellow-500">
                                        <Gift className="w-5 h-5 flex-shrink-0" />
                                        <p className="text-sm font-medium">Obtén un bono adicional de <span className="font-bold">10%</span> con un depósito mínimo de <span className="font-bold">$10.000</span></p>
                                    </div>

                                    {/* Deposit Method */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Método de depósito</label>
                                        <div className="space-y-3">
                                            <button
                                                onClick={() => setPaymentMethod('pago_movil')}
                                                className={cn(
                                                    "w-full btn-secondary rounded-xl px-4 py-3 flex items-center justify-between text-foreground hover:border-primary/50 transition-all duration-300",
                                                    paymentMethod === 'pago_movil' && "border-primary bg-primary/10"
                                                )}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">MP</div>
                                                    <span className="font-medium">Mercado Pago</span>
                                                </div>
                                                {paymentMethod === 'pago_movil' && (
                                                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
                                                )}
                                            </button>

                                            <button
                                                onClick={() => setPaymentMethod('binance')}
                                                className={cn(
                                                    "w-full btn-secondary rounded-xl px-4 py-3 flex items-center justify-between text-foreground hover:border-primary/50 transition-all duration-300",
                                                    paymentMethod === 'binance' && "border-primary bg-primary/10"
                                                )}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-[10px] font-bold text-black">B</div>
                                                    <span className="font-medium">Binance Pay</span>
                                                </div>
                                                {paymentMethod === 'binance' && (
                                                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Document Number */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Número de CUIT/CUIL <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            className="input-primary"
                                            placeholder="20-12345678-9"
                                        />
                                    </div>

                                    {/* Amount */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Cantidad del depósito</label>
                                        <input
                                            type="number"
                                            value={depositAmount}
                                            onChange={(e) => setDepositAmount(e.target.value)}
                                            className="input-primary font-mono text-lg font-bold"
                                        />
                                        <div className="grid grid-cols-3 gap-3 mt-3">
                                            {depositPresets.map((preset) => (
                                                <button
                                                    key={preset}
                                                    onClick={() => setDepositAmount(preset)}
                                                    className={cn(
                                                        "py-3 rounded-xl text-sm font-bold transition-all duration-200 border",
                                                        depositAmount === preset
                                                            ? "bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(253,176,34,0.2)]"
                                                            : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/5 hover:border-white/10 hover:text-foreground"
                                                    )}
                                                >
                                                    {parseInt(preset).toLocaleString('es-AR', { minimumFractionDigits: 2 })} ARS
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button className="w-full btn-primary py-4 rounded-xl mt-6 flex items-center justify-center space-x-2 text-lg">
                                        <span>Depositar</span>
                                    </button>

                                    {/* Info */}
                                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 space-y-2 text-xs text-muted-foreground">
                                        <div className="flex items-start space-x-2">
                                            <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                            <div className="space-y-1">
                                                <p>1. El monto de tu transferencia debe COINCIDIR con el monto del envío.</p>
                                                <p>2. Cada ID de pedido SOLO puede utilizarse una vez, para evitar duplicados.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'retirar' && (
                                <div className="space-y-8 max-w-2xl">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="p-3 bg-red-500/10 rounded-xl">
                                            <ArrowUpRight className="w-6 h-6 text-red-500" />
                                        </div>
                                        <h2 className="text-xl font-bold">Retirar Fondos</h2>
                                    </div>

                                    {/* Currency Selector */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-muted-foreground">Retirar moneda</label>
                                        <div className="relative group">
                                            <button className="w-full btn-secondary rounded-xl px-4 py-3 flex items-center justify-between text-foreground hover:border-primary/50 transition-all duration-300">
                                                <div className="flex items-center space-x-3">
                                                    <img src="https://flagcdn.com/w40/ar.png" alt="ARS" className="w-6 h-4 rounded-sm shadow-sm" />
                                                    <span className="font-bold tracking-wide">ARS</span>
                                                </div>
                                                <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Withdrawal Method */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-muted-foreground">Método de Retiro</label>
                                        <button className="w-full btn-secondary rounded-xl px-4 py-3.5 flex items-center justify-between text-foreground hover:border-primary/50 transition-all duration-300">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 text-red-500 font-bold text-xs">A</div>
                                                <div className="flex flex-col items-start">
                                                    <span className="text-sm font-bold">AstroPay</span>
                                                    <span className="text-xs text-muted-foreground">AstroPay1</span>
                                                </div>
                                            </div>
                                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                    </div>

                                    {/* Amount */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-medium text-muted-foreground">Monto a retirar</label>
                                            <span className="text-xs text-red-400 font-medium bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">Mín: {minAmount.toLocaleString('es-AR', { minimumFractionDigits: 2 })} ARS</span>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="input-primary font-mono text-lg font-bold"
                                                placeholder="0.00"
                                            />
                                        </div>

                                        <div className="grid grid-cols-4 gap-3 mt-3">
                                            {['Mín', '25%', '50%', 'Máx'].map((label, index) => (
                                                <button
                                                    key={label}
                                                    onClick={() => handlePercentageClick([0, 0.25, 0.5, 1][index])}
                                                    className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-muted-foreground hover:text-foreground py-2 rounded-lg text-xs font-medium transition-all duration-200"
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button className="w-full btn-primary py-4 rounded-xl mt-6 uppercase tracking-wide text-sm font-bold">
                                        Solicitar Retiro
                                    </button>
                                </div>
                            )}

                            {(activeTab === 'saldo' || activeTab === 'historial') && (
                                <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground text-center">
                                    <div className="w-48 h-48 mb-6 relative">
                                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-20 animate-pulse" />
                                        <img src="/gaucho.png" alt="Empty State" className="w-full h-full object-contain relative z-10 opacity-80" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-2">
                                        {activeTab === 'saldo' ? 'Sin saldo disponible' : 'Sin movimientos'}
                                    </h3>
                                    <p className="max-w-xs text-sm opacity-60">
                                        {activeTab === 'saldo'
                                            ? 'Aún no tienes saldo en tu cuenta. ¡Realiza un depósito para comenzar!'
                                            : 'Aún no has realizado ninguna transacción. Tu historial aparecerá aquí.'}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
