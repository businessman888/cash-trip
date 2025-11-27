'use client'

import { useState } from 'react'
import { FiX, FiCamera, FiUpload } from 'react-icons/fi'
import Image from 'next/image'

interface ProfileEditModalProps {
    isOpen: boolean
    onClose: () => void
}

export function ProfileEditModal({ isOpen, onClose }: ProfileEditModalProps) {
    const [formData, setFormData] = useState({
        name: 'Alexandre Costa',
        monthlyIncome: '5000-10000',
        age: '28',
        gender: 'masculino',
        tripsPerYear: '2-4'
    })
    const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop')

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfileImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = () => {
        // TODO: Implement save logic with API call
        console.log('Saving profile data:', formData)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div
                className="w-full max-w-md rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
                style={{ backgroundColor: 'var(--surface-card)' }}
            >
                {/* Header */}
                <div
                    className="sticky top-0 border-b p-4 flex items-center justify-between"
                    style={{
                        backgroundColor: 'var(--surface-card)',
                        borderColor: 'var(--border-line)'
                    }}
                >
                    <h2 className="font-inria-sans font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
                        Editar Perfil
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <FiX className="text-xl" style={{ color: 'var(--text-primary)' }} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Profile Photo */}
                    <div className="flex flex-col items-center">
                        <div className="relative mb-3">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#FF5F38]">
                                <Image
                                    src={profileImage}
                                    alt="Profile"
                                    width={96}
                                    height={96}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#FF5F38] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#E64E28] transition-colors shadow-lg">
                                <FiCamera className="text-white text-sm" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                            Clique no ícone para alterar a foto
                        </p>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                            Nome
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full p-3 rounded-xl border border-[#FF5F38] focus:ring-2 focus:ring-[#FF5F38] focus:border-[#FF5F38] outline-none transition-all"
                            style={{
                                color: 'var(--text-primary)',
                                backgroundColor: 'var(--surface-main)'
                            }}
                        />
                    </div>

                    {/* Monthly Income */}
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                            Renda Mensal
                        </label>
                        <select
                            value={formData.monthlyIncome}
                            onChange={(e) => handleChange('monthlyIncome', e.target.value)}
                            className="w-full p-3 rounded-xl border border-[#FF5F38] focus:ring-2 focus:ring-[#FF5F38] focus:border-[#FF5F38] outline-none transition-all"
                            style={{
                                color: 'var(--text-primary)',
                                backgroundColor: 'var(--surface-main)'
                            }}
                        >
                            <option value="0-2000" style={{ backgroundColor: 'var(--surface-main)', color: 'var(--text-primary)' }}>Até R$ 2.000</option>
                            <option value="2000-5000" style={{ backgroundColor: 'var(--surface-main)', color: 'var(--text-primary)' }}>R$ 2.000 - R$ 5.000</option>
                            <option value="5000-10000" style={{ backgroundColor: 'var(--surface-main)', color: 'var(--text-primary)' }}>R$ 5.000 - R$ 10.000</option>
                            <option value="10000-20000" style={{ backgroundColor: 'var(--surface-main)', color: 'var(--text-primary)' }}>R$ 10.000 - R$ 20.000</option>
                            <option value="20000+" style={{ backgroundColor: 'var(--surface-main)', color: 'var(--text-primary)' }}>Acima de R$ 20.000</option>
                        </select>
                    </div>

                    {/* Age */}
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                            Idade
                        </label>
                        <input
                            type="number"
                            value={formData.age}
                            onChange={(e) => handleChange('age', e.target.value)}
                            min="18"
                            max="120"
                            className="w-full p-3 rounded-xl border border-[#FF5F38] focus:ring-2 focus:ring-[#FF5F38] focus:border-[#FF5F38] outline-none transition-all"
                            style={{
                                color: 'var(--text-primary)',
                                backgroundColor: 'var(--surface-main)'
                            }}
                        />
                    </div>

                    {/* Gender Identity */}
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                            Como se identifica
                        </label>
                        <select
                            value={formData.gender}
                            onChange={(e) => handleChange('gender', e.target.value)}
                            className="w-full p-3 rounded-xl border border-[#FF5F38] focus:ring-2 focus:ring-[#FF5F38] focus:border-[#FF5F38] outline-none transition-all"
                            style={{
                                color: 'var(--text-primary)',
                                backgroundColor: 'var(--surface-main)'
                            }}
                        >
                            <option value="masculino" style={{ backgroundColor: 'var(--surface-main)', color: 'var(--text-primary)' }}>Masculino</option>
                            <option value="feminino" style={{ backgroundColor: 'var(--surface-main)', color: 'var(--text-primary)' }}>Feminino</option>
                            <option value="nao-binario" style={{ backgroundColor: 'var(--surface-main)', color: 'var(--text-primary)' }}>Não-binário</option>
                            <option value="prefiro-nao-dizer" style={{ backgroundColor: 'var(--surface-main)', color: 'var(--text-primary)' }}>Prefiro não dizer</option>
                            <option value="outro" style={{ backgroundColor: 'var(--surface-main)', color: 'var(--text-primary)' }}>Outro</option>
                        </select>
                    </div>

                    {/* Trips per Year */}
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                            Quantas viagens por ano
                        </label>
                        <select
                            value={formData.tripsPerYear}
                            onChange={(e) => handleChange('tripsPerYear', e.target.value)}
                            className="w-full p-3 rounded-xl border border-[#FF5F38] focus:ring-2 focus:ring-[#FF5F38] focus:border-[#FF5F38] outline-none transition-all"
                            style={{
                                color: 'var(--text-primary)',
                                backgroundColor: 'var(--surface-main)'
                            }}
                        >
                            <option value="0-1" style={{ backgroundColor: 'var(--surface-main)', color: 'var(--text-primary)' }}>0-1 viagem</option>
                            <option value="2-4" style={{ backgroundColor: 'var(--surface-main)', color: 'var(--text-primary)' }}>2-4 viagens</option>
                            <option value="5-8" style={{ backgroundColor: 'var(--surface-main)', color: 'var(--text-primary)' }}>5-8 viagens</option>
                            <option value="9+" style={{ backgroundColor: 'var(--surface-main)', color: 'var(--text-primary)' }}>9+ viagens</option>
                        </select>
                    </div>
                </div>

                {/* Actions */}
                <div
                    className="sticky bottom-0 border-t p-4 flex gap-3"
                    style={{
                        backgroundColor: 'var(--surface-card)',
                        borderColor: 'var(--border-line)'
                    }}
                >
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 rounded-xl border border-[#FF5F38] font-bold transition-colors hover:bg-[#FF5F38]/10"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-3 px-4 bg-[#FF5F38] text-white font-bold rounded-xl hover:bg-[#E64E28] transition-colors shadow-lg shadow-orange-500/30"
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    )
}
