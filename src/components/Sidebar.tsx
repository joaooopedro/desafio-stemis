import React, { useState } from 'react';
import { Plus, Megaphone, FileText, FormInput, CreditCard, CheckCircle, Settings, Lightbulb } from 'lucide-react';
import type { FunnelStage } from '../types';
import { CustomStageModal, type CustomStageData } from './CustomStageModal';

interface SidebarProps {
    onAddNode: (stage: FunnelStage, position: { x: number; y: number }) => void;
}

const stageTypes = [
    { type: 'ad' as const, label: 'Anúncio', icon: Megaphone, description: 'Anúncio pago' },
    { type: 'landing' as const, label: 'Landing Page', icon: FileText, description: 'Página de destino' },
    { type: 'form' as const, label: 'Formulário', icon: FormInput, description: 'Coleta de dados' },
    { type: 'checkout' as const, label: 'Checkout', icon: CreditCard, description: 'Finalização' },
    { type: 'thank-you' as const, label: 'Obrigado', icon: CheckCircle, description: 'Confirmação' },
];

const Sidebar: React.FC<SidebarProps> = ({ onAddNode }) => {
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

    const handleAddNode = (type: FunnelStage['type']) => {
        const label = stageTypes.find(s => s.type === type)?.label || 'Etapa';

        const newStage: FunnelStage = {
            id: `stage-${Date.now()}`,
            label,
            type,
            color: getColorForType(type),
            metrics: {
                visitors: Math.floor(Math.random() * 10000) + 1000,
                conversionRate: Math.random() * 100,
                avgTimeOnPage: Math.floor(Math.random() * 300) + 30,
                bounceRate: Math.random() * 100,
            },
        };

        const position = {
            x: Math.random() * 400 + 100,
            y: Math.random() * 400 + 100,
        };

        onAddNode(newStage, position);
    };

    const handleCustomStageConfirm = (data: CustomStageData) => {
        const customStage: FunnelStage = {
            id: `stage-${Date.now()}`,
            label: data.label,
            type: 'custom',
            color: '#6366f1',
            metrics: {
                visitors: data.metrics.visitors,
                conversionRate: data.metrics.conversionRate,
                avgTimeOnPage: data.metrics.avgTimeOnPage,
                bounceRate: data.metrics.bounceRate,
            },
        };

        const position = {
            x: Math.random() * 400 + 100,
            y: Math.random() * 400 + 100,
        };

        onAddNode(customStage, position);
        setIsCustomModalOpen(false);
    };

    return (
        <div className="w-72 bg-slate-900 text-slate-100 shadow-2xl border-r border-slate-700 flex flex-col h-screen">
            <div className="p-6 border-b border-slate-700 bg-slate-950">
                <h2 className="text-lg font-semibold mb-2">Construtor de Funis</h2>
                <p className="text-xs text-slate-400">Clique para adicionar etapas</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <div className="mb-4">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                        Etapas do Funil
                    </h3>
                </div>

                <div className="space-y-2">
                    {stageTypes.map((stage) => {
                        const Icon = stage.icon;
                        return (
                            <div key={stage.type}>
                                <button
                                    onClick={() => handleAddNode(stage.type)}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all duration-200 group hover:shadow-lg border border-slate-700 hover:border-slate-600"
                                >
                                    <Icon size={18} className="text-slate-400 group-hover:text-slate-200 flex-shrink-0" />
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="font-medium text-sm text-slate-100">{stage.label}</div>
                                        <div className="text-xs text-slate-500">{stage.description}</div>
                                    </div>
                                    <Plus size={16} className="text-slate-400 group-hover:text-slate-200 flex-shrink-0" />
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-700">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                        Avançado
                    </h3>
                    <button
                        onClick={() => setIsCustomModalOpen(true)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all duration-200 border border-slate-700 hover:border-slate-600"
                    >
                        <Settings size={18} className="text-slate-400 flex-shrink-0" />
                        <div className="flex-1 text-left min-w-0">
                            <div className="font-medium text-sm text-slate-100">Etapa Customizada</div>
                            <div className="text-xs text-slate-500">Personalizada</div>
                        </div>
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            <CustomStageModal
                isOpen={isCustomModalOpen}
                onClose={() => setIsCustomModalOpen(false)}
                onConfirm={handleCustomStageConfirm}
            />

            <div className="p-4 border-t border-slate-700 bg-slate-950 text-xs text-slate-400 space-y-2">
                <div className="flex gap-2">
                    <Lightbulb size={16} className="text-slate-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium text-slate-300 mb-1">Instruções:</p>
                        <ul className="space-y-1 text-slate-500">
                            <li>• Clique em uma etapa para adicionar</li>
                            <li>• Arraste entre nós para conectar</li>
                            <li>• Clique em "Editar" para alterar dados</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

const getColorForType = (type: FunnelStage['type']): string => {
    const colors: Record<FunnelStage['type'], string> = {
        ad: '#3b82f6',
        landing: '#8b5cf6',
        form: '#ec4899',
        checkout: '#f59e0b',
        'thank-you': '#10b981',
        custom: '#6366f1',
    };
    return colors[type];
};

export default Sidebar;
