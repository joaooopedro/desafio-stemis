import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CustomStageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: CustomStageData) => void;
}

export interface CustomStageData {
    label: string;
    metrics: {
        visitors: number;
        conversionRate: number;
        avgTimeOnPage: number;
        bounceRate: number;
    };
}

export const CustomStageModal: React.FC<CustomStageModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
}) => {
    const [formData, setFormData] = useState<CustomStageData>({
        label: '',
        metrics: {
            visitors: 1000,
            conversionRate: 50,
            avgTimeOnPage: 60,
            bounceRate: 20,
        },
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'label') {
            setFormData(prev => ({ ...prev, label: value }));
        } else {
            const metricName = name as keyof typeof formData.metrics;
            setFormData(prev => ({
                ...prev,
                metrics: {
                    ...prev.metrics,
                    [metricName]: parseFloat(value) || 0,
                },
            }));
        }
    };

    const handleConfirm = () => {
        if (!formData.label.trim()) {
            alert('Por favor, insira um nome para a etapa');
            return;
        }
        onConfirm(formData);
        setFormData({
            label: '',
            metrics: {
                visitors: 1000,
                conversionRate: 50,
                avgTimeOnPage: 60,
                bounceRate: 20,
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-slate-800 rounded-lg shadow-2xl w-96 border border-slate-700">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <h2 className="text-xl font-semibold text-slate-50">Criar Etapa Customizada</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Stage Name */}
                    <div>
                        <label htmlFor="label" className="block text-sm font-medium text-slate-300 mb-2">
                            Nome da Etapa
                        </label>
                        <input
                            type="text"
                            id="label"
                            name="label"
                            value={formData.label}
                            onChange={handleInputChange}
                            placeholder="Ex: Segmentação por Email"
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                        />
                    </div>

                    {/* Metrics */}
                    <div className="space-y-3 pt-2">
                        {/* Visitors */}
                        <div>
                            <label htmlFor="visitors" className="text-sm font-medium text-slate-300 flex justify-between">
                                <span>Visitantes</span>
                                <span className="text-cyan-400">{formData.metrics.visitors}</span>
                            </label>
                            <input
                                type="range"
                                id="visitors"
                                name="visitors"
                                min="0"
                                max="50000"
                                step="100"
                                value={formData.metrics.visitors}
                                onChange={handleInputChange}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            />
                        </div>

                        {/* Conversion Rate */}
                        <div>
                            <label htmlFor="conversionRate" className="text-sm font-medium text-slate-300 flex justify-between">
                                <span>Taxa de Conversão (%)</span>
                                <span className="text-amber-400">{formData.metrics.conversionRate.toFixed(1)}%</span>
                            </label>
                            <input
                                type="range"
                                id="conversionRate"
                                name="conversionRate"
                                min="0"
                                max="100"
                                step="0.1"
                                value={formData.metrics.conversionRate}
                                onChange={handleInputChange}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                        </div>

                        {/* Average Time on Page */}
                        <div>
                            <label htmlFor="avgTimeOnPage" className="text-sm font-medium text-slate-300 flex justify-between">
                                <span>Tempo Médio (seg)</span>
                                <span className="text-blue-400">{formData.metrics.avgTimeOnPage}</span>
                            </label>
                            <input
                                type="range"
                                id="avgTimeOnPage"
                                name="avgTimeOnPage"
                                min="0"
                                max="600"
                                step="5"
                                value={formData.metrics.avgTimeOnPage}
                                onChange={handleInputChange}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>

                        {/* Bounce Rate */}
                        <div>
                            <label htmlFor="bounceRate" className="text-sm font-medium text-slate-300 flex justify-between">
                                <span>Taxa de Rejeição (%)</span>
                                <span className="text-red-400">{formData.metrics.bounceRate.toFixed(1)}%</span>
                            </label>
                            <input
                                type="range"
                                id="bounceRate"
                                name="bounceRate"
                                min="0"
                                max="100"
                                step="0.1"
                                value={formData.metrics.bounceRate}
                                onChange={handleInputChange}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-slate-700 bg-slate-700/30">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all"
                    >
                        Criar Etapa
                    </button>
                </div>
            </div>
        </div>
    );
};
