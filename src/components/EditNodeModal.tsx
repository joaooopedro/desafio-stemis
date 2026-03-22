import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { FunnelStage } from '../types';

interface EditNodeModalProps {
    node: FunnelStage;
    onClose: () => void;
    onSave: (updates: Partial<FunnelStage>) => void;
}

const EditNodeModal: React.FC<EditNodeModalProps> = ({ node, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        label: node.label,
        description: node.description || '',
        visitors: node.metrics.visitors,
        conversionRate: node.metrics.conversionRate,
        bounceRate: node.metrics.bounceRate,
        avgTimeOnPage: node.metrics.avgTimeOnPage,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        onSave({
            label: formData.label,
            description: formData.description,
            metrics: {
                visitors: formData.visitors,
                conversionRate: formData.conversionRate,
                bounceRate: formData.bounceRate,
                avgTimeOnPage: formData.avgTimeOnPage,
            },
        });

        onClose();
    };

    const handleChange = (field: string, value: any) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-md animate-slide-in border border-slate-700">
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-100">Editar {node.label}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-700 rounded transition-colors text-slate-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Nome da Etapa
                        </label>
                        <input
                            type="text"
                            value={formData.label}
                            onChange={(e) => handleChange('label', e.target.value)}
                            className="w-full px-4 py-2 border border-slate-600 bg-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors placeholder-slate-500"
                            placeholder="Ex: Anúncio Google Ads"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Descrição (Opcional)
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className="w-full px-4 py-2 border border-slate-600 bg-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none placeholder-slate-500"
                            rows={2}
                            placeholder="Descreva a etapa..."
                        />
                    </div>

                    <div className="bg-slate-700 p-4 rounded-lg space-y-4 border border-slate-600">
                        <h3 className="font-semibold text-slate-100 text-sm mb-3">Métricas</h3>

                        <div>
                            <label className="block text-sm text-slate-300 mb-1">
                                Visitantes: {formData.visitors.toLocaleString()}
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100000"
                                step="100"
                                value={formData.visitors}
                                onChange={(e) => handleChange('visitors', parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                            />
                            <input
                                type="number"
                                value={formData.visitors}
                                onChange={(e) => handleChange('visitors', parseInt(e.target.value) || 0)}
                                className="w-full mt-2 px-3 py-1 border border-slate-600 bg-slate-700 text-slate-100 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-300 mb-1">
                                Taxa de Conversão: {formData.conversionRate.toFixed(1)}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="0.1"
                                value={formData.conversionRate}
                                onChange={(e) => handleChange('conversionRate', parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-300 mb-1">
                                Taxa de Rejeição: {formData.bounceRate.toFixed(1)}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="0.1"
                                value={formData.bounceRate}
                                onChange={(e) => handleChange('bounceRate', parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-300 mb-1">
                                Tempo Médio: {formData.avgTimeOnPage}s
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="600"
                                step="5"
                                value={formData.avgTimeOnPage}
                                onChange={(e) => handleChange('avgTimeOnPage', parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-400"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-slate-600 bg-slate-700 text-slate-100 font-medium rounded-lg hover:bg-slate-600 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditNodeModal;
