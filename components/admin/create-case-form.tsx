'use client'

import { useState, useActionState, startTransition } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createCase } from '@/app/actions/create-case'
import { Plus, Trash2, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Schema for client-side validation (must match server-side)
const itemSchema = z.object({
    name: z.string().min(1, 'Nombre requerido'),
    value: z.number().min(0, 'Valor debe ser positivo'),
    image_url: z.string().url('URL inválida'),
    probability: z.number().min(0).max(100),
})

const caseSchema = z.object({
    name: z.string().min(1, 'Nombre requerido'),
    description: z.string().optional(),
    price: z.number().min(0, 'Precio debe ser positivo'),
    image_url: z.string().url('URL inválida'),
    items: z.array(itemSchema)
        .min(2, 'Mínimo 2 ítems')
        .max(15, 'Máximo 15 ítems')
        .refine((items) => {
            const total = items.reduce((sum, item) => sum + item.probability, 0)
            return Math.abs(total - 100) < 0.01
        }, 'La probabilidad total debe ser exactamente 100%'),
})

type CaseFormValues = z.infer<typeof caseSchema>

const initialState = {
    success: false,
    error: '',
    errors: {},
}

export default function CreateCaseForm() {
    const [state, formAction, isPending] = useActionState(createCase, initialState)

    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<CaseFormValues>({
        resolver: zodResolver(caseSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            image_url: '',
            items: [
                { name: '', value: 0, image_url: '', probability: 50 },
                { name: '', value: 0, image_url: '', probability: 50 },
            ],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items',
    })

    const items = watch('items')
    const totalProbability = items.reduce((sum, item) => sum + (Number(item.probability) || 0), 0)
    const isProbabilityValid = Math.abs(totalProbability - 100) < 0.01

    const onSubmit = (data: CaseFormValues) => {
        const formData = new FormData()
        formData.append('name', data.name)
        if (data.description) formData.append('description', data.description)
        formData.append('price', data.price.toString())
        formData.append('image_url', data.image_url)
        formData.append('items', JSON.stringify(data.items))

        // Wrap in transition for useActionState
        // Actually useActionState handles the action call, but we need to pass formData.
        // Since we are using handleSubmit from RHF, we need to manually trigger the action.
        // However, useActionState expects to be called via form action or startTransition.
        // A simpler way with RHF + Server Actions is to use a hidden form or construct FormData manually and call the action wrapper.
        // Let's call formAction directly with the constructed FormData.

        startTransition(() => {
            formAction(formData)
        })
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-card rounded-xl border border-border">
            <h2 className="text-2xl font-bold mb-6 text-white">Crear Nueva Caja</h2>

            {state.error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-500">
                    <AlertCircle className="w-5 h-5" />
                    <span>{state.error}</span>
                </div>
            )}

            {state.success && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-500">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Caja creada exitosamente!</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Case Details */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white/80 border-b border-white/10 pb-2">Detalles de la Caja</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                            <input
                                {...register('name')}
                                className="input-primary"
                                placeholder="Ej: Dragon Lore Case"
                            />
                            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Precio ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('price', { valueAsNumber: true })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none transition-colors"
                            />
                            {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-muted-foreground">Descripción</label>
                            <textarea
                                {...register('description')}
                                className="input-primary min-h-[80px]"
                                placeholder="Descripción de la caja..."
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-muted-foreground">Imagen URL</label>
                            <input
                                {...register('image_url')}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none transition-colors"
                                placeholder="https://..."
                            />
                            {errors.image_url && <p className="text-xs text-red-500">{errors.image_url.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <h3 className="text-lg font-semibold text-white/80">Ítems ({fields.length})</h3>
                        <div className={cn(
                            "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold",
                            isProbabilityValid ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        )}>
                            Total Probabilidad: {totalProbability.toFixed(2)}%
                        </div>
                    </div>

                    {errors.items && <p className="text-sm text-red-500 text-center">{errors.items.message || errors.items.root?.message}</p>}

                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-black/20 rounded-lg border border-white/5 relative group">
                                <div className="md:col-span-3 space-y-1">
                                    <label className="text-xs text-muted-foreground">Nombre</label>
                                    <input
                                        {...register(`items.${index}.name`)}
                                        className="input-primary py-1.5 text-sm"
                                        placeholder="Item Name"
                                    />
                                    {errors.items?.[index]?.name && <p className="text-[10px] text-red-500">{errors.items[index].name.message}</p>}
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-xs text-muted-foreground">Valor ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register(`items.${index}.value`, { valueAsNumber: true })}
                                        className="w-full bg-black/40 border border-white/10 rounded px-3 py-1.5 text-sm text-white"
                                    />
                                    {errors.items?.[index]?.value && <p className="text-[10px] text-red-500">{errors.items[index].value.message}</p>}
                                </div>
                                <div className="md:col-span-4 space-y-1">
                                    <label className="text-xs text-muted-foreground">Imagen URL</label>
                                    <input
                                        {...register(`items.${index}.image_url`)}
                                        className="w-full bg-black/40 border border-white/10 rounded px-3 py-1.5 text-sm text-white"
                                        placeholder="https://..."
                                    />
                                    {errors.items?.[index]?.image_url && <p className="text-[10px] text-red-500">{errors.items[index].image_url.message}</p>}
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-xs text-muted-foreground">Probabilidad (%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register(`items.${index}.probability`, { valueAsNumber: true })}
                                        className="w-full bg-black/40 border border-white/10 rounded px-3 py-1.5 text-sm text-white"
                                    />
                                    {errors.items?.[index]?.probability && <p className="text-[10px] text-red-500">{errors.items[index].probability.message}</p>}
                                </div>
                                <div className="md:col-span-1 flex items-end justify-center pb-1">
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                        disabled={fields.length <= 2}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => append({ name: '', value: 0, image_url: '', probability: 0 })}
                        className="w-full py-3 border border-dashed border-white/20 rounded-lg text-muted-foreground hover:text-white hover:border-white/40 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                        disabled={fields.length >= 15}
                    >
                        <Plus className="w-4 h-4" />
                        Agregar Ítem
                    </button>
                </div>

                <div className="pt-6 border-t border-white/10">
                    <button
                        type="submit"
                        disabled={isPending || !isProbabilityValid}
                        className="w-full btn-primary py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creando Caja...
                            </>
                        ) : (
                            'Crear Caja'
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
