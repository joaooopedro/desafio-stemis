import React from 'react';
import { X, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { useFunnelStore } from '../store/funnelStore';

interface StatsModalProps {
    onClose: () => void;
}

const StatsModal: React.FC<StatsModalProps> = ({ onClose }) => {
    const { nodes } = useFunnelStore();

    const calculateStats = () => {
        if (nodes.length === 0) {
            return {
                totalVisitors: 0,
                avgConversion: 0,
                avgBounce: 0,
                avgTimeOnPage: 0,
                nodeStats: [],
            };
        }

        const totalVisitors = nodes.reduce((acc, node) => acc + node.data.metrics.visitors, 0);
        const avgConversion = nodes.reduce((acc, node) => acc + node.data.metrics.conversionRate, 0) / nodes.length;
        const avgBounce = nodes.reduce((acc, node) => acc + node.data.metrics.bounceRate, 0) / nodes.length;
        const avgTimeOnPage = nodes.reduce((acc, node) => acc + node.data.metrics.avgTimeOnPage, 0) / nodes.length;

        return {
            totalVisitors,
            avgConversion,
            avgBounce,
            avgTimeOnPage,
            nodeStats: nodes.map((node) => ({
                name: node.data.label,
                ...node.data.metrics,
            })),
        };
    };

    const stats = calculateStats();

    if (nodes.length === 0) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-slate-100">Relatório de Desempenho</h2>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-slate-700 rounded transition-colors text-slate-400"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="text-center py-12">
                        <p className="text-slate-400 text-lg">Nenhuma etapa adicionada ainda.</p>
                        <p className="text-slate-500 mt-2">Adicione etapas ao seu funil para ver estatísticas.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-4xl my-8 animate-slide-in border border-slate-700">
                <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-900">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-100">Relatório de Desempenho</h2>
                        <p className="text-slate-400 text-sm mt-1">Análise do seu funil de campanhas</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-700 rounded transition-colors text-slate-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
                            <div className="flex items-center gap-3 mb-2">
                                <Users size={20} className="text-cyan-400" />
                                <span className="text-sm font-medium text-slate-300">Total de Visitantes</span>
                            </div>
                            <p className="text-2xl font-bold text-cyan-400">
                                {stats.totalVisitors.toLocaleString()}
                            </p>
                        </div>

                        <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
                            <div className="flex items-center gap-3 mb-2">
                                <TrendingUp size={20} className="text-cyan-400" />
                                <span className="text-sm font-medium text-slate-300">Conv. Média</span>
                            </div>
                            <p className="text-2xl font-bold text-cyan-400">
                                {stats.avgConversion.toFixed(1)}%
                            </p>
                        </div>

                        <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
                            <div className="flex items-center gap-3 mb-2">
                                <BarChart3 size={20} className="text-amber-400" />
                                <span className="text-sm font-medium text-slate-300">Rejeição Média</span>
                            </div>
                            <p className="text-2xl font-bold text-amber-400">
                                {stats.avgBounce.toFixed(1)}%
                            </p>
                        </div>

                        <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-xl">⏱</span>
                                <span className="text-sm font-medium text-slate-300">Tempo Médio</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-400">
                                {Math.round(stats.avgTimeOnPage)}s
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-slate-100 mb-4">Detalhes por Etapa</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-slate-700 border-slate-600">
                                        <th className="text-left px-4 py-3 font-semibold text-slate-300">Etapa</th>
                                        <th className="text-right px-4 py-3 font-semibold text-slate-300">Visitantes</th>
                                        <th className="text-right px-4 py-3 font-semibold text-slate-300">Conversão</th>
                                        <th className="text-right px-4 py-3 font-semibold text-slate-300">Rejeição</th>
                                        <th className="text-right px-4 py-3 font-semibold text-slate-300">Tempo (s)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.nodeStats.map((node, idx) => (
                                        <tr key={idx} className="border-b hover:bg-slate-700 transition-colors border-slate-700">
                                            <td className="px-4 py-3 font-medium text-slate-100">{node.name}</td>
                                            <td className="text-right px-4 py-3 text-slate-300">
                                                {node.visitors.toLocaleString()}
                                            </td>
                                            <td className="text-right px-4 py-3 text-cyan-400 font-medium">
                                                {node.conversionRate.toFixed(1)}%
                                            </td>
                                            <td className="text-right px-4 py-3 text-amber-400 font-medium">
                                                {node.bounceRate.toFixed(1)}%
                                            </td>
                                            <td className="text-right px-4 py-3 text-blue-400 font-medium">
                                                {Math.round(node.avgTimeOnPage)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-slate-700 border-l-4 border-blue-500 p-4 rounded">
                        <h3 className="font-semibold text-slate-100 mb-2">Análise</h3>
                        <ul className="text-sm text-slate-300 space-y-1">
                            <li>
                                • Etapa com maior conversão:{' '}
                                <span className="font-semibold text-cyan-400">
                                    {stats.nodeStats.reduce((max, node) =>
                                        node.conversionRate > max.conversionRate ? node : max
                                    ).name}
                                </span>{' '}
                                ({stats.nodeStats.reduce((max, node) => (node.conversionRate > max.conversionRate ? node : max)).conversionRate.toFixed(1)}%)
                            </li>
                            <li>
                                • Total de visitantes:{' '}
                                <span className="font-semibold text-cyan-400">{stats.totalVisitors.toLocaleString()}</span>
                            </li>
                            <li>
                                • Taxa de rejeição média:{' '}
                                <span className="font-semibold text-amber-400">{stats.avgBounce.toFixed(1)}%</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-700 bg-slate-900 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatsModal;
