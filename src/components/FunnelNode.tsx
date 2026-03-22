import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Trash2, Edit2, Megaphone, FileText, FormInput, CreditCard, CheckCircle, Settings } from 'lucide-react';
import type { FunnelStage } from '../types';

interface FunnelNodeProps {
    data: FunnelStage;
    selected?: boolean;
    onDelete?: (id: string) => void;
    onEdit?: () => void;
}

const FunnelNode: React.FC<FunnelNodeProps> = ({
    data,
    selected = false,
    onDelete,
    onEdit
}) => {
    const getIcon = (type: string) => {
        switch (type) {
            case 'ad':
                return <Megaphone size={20} />;
            case 'landing':
                return <FileText size={20} />;
            case 'form':
                return <FormInput size={20} />;
            case 'checkout':
                return <CreditCard size={20} />;
            case 'thank-you':
                return <CheckCircle size={20} />;
            case 'custom':
                return <Settings size={20} />;
            default:
                return <Megaphone size={20} />;
        }
    };

    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    };

    return (
        <div
            className={`
        min-w-[220px] rounded-lg border-2 transition-all duration-200 p-4
        ${selected
                    ? 'border-blue-500 shadow-xl bg-slate-700'
                    : 'border-slate-600 hover:border-blue-400 shadow-lg hover:shadow-xl'
                }
        bg-slate-800
      `}
        >
            <Handle type="target" position={Position.Top} />

            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                    <div className="text-slate-300">
                        {getIcon(data.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-100 text-sm truncate">{data.label}</h3>
                        <p className="text-xs text-slate-400 capitalize">{data.type}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-2 mb-3 bg-slate-700 rounded p-3 border border-slate-600">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Visitantes:</span>
                    <span className="font-semibold text-slate-100">
                        {formatNumber(Math.round(data.metrics.visitors))}
                    </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Conversão:</span>
                    <span className="font-semibold text-cyan-400">
                        {data.metrics.conversionRate.toFixed(1)}%
                    </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Bounce:</span>
                    <span className="font-semibold text-amber-400">
                        {data.metrics.bounceRate.toFixed(1)}%
                    </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Tempo médio:</span>
                    <span className="font-semibold text-blue-400">
                        {Math.round(data.metrics.avgTimeOnPage)}s
                    </span>
                </div>
            </div>

            <div className="flex gap-2">
                {onEdit && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
                    >
                        <Edit2 size={14} />
                        Editar
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            console.log('🗑️ FunnelNode delete button clicked for node:', data.id, 'calling onDelete');
                            onDelete(data.id);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-2 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors"
                    >
                        <Trash2 size={14} />
                        Deletar
                    </button>
                )}
            </div>

            <Handle type="source" position={Position.Bottom} />
        </div>
    );
};

export default memo(FunnelNode, (prevProps, nextProps) => {
    // Custom comparison - only update if data or selected changed
    // Don't compare callbacks since they change every render with refs
    return (
        prevProps.data === nextProps.data &&
        prevProps.selected === nextProps.selected
    );
});
