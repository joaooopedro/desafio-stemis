import React, { useState } from 'react';
import { Download, Trash2, BarChart3 } from 'lucide-react';
import { useFunnelStore } from '../store/funnelStore';

interface HeaderProps {
    onShowStats: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowStats }) => {
    const { projectName, updateProjectName, clearProject, nodes, edges, selectedNodeId, deleteNode } = useFunnelStore();
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState(projectName);

    const handleSaveName = () => {
        if (tempName.trim()) {
            updateProjectName(tempName);
            setIsEditingName(false);
        }
    };

    const handleExport = () => {
        const data = {
            name: projectName,
            nodes,
            edges,
            createdAt: new Date().toISOString(),
        };

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2)));
        element.setAttribute('download', `${projectName}.json`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handleClear = () => {
        if (window.confirm('Tem certeza que deseja limpar o seu funil? Esta ação não pode ser desfeita.')) {
            clearProject();
        }
    };

    const totalVisitors = nodes.reduce((acc, node) => acc + node.data.metrics.visitors, 0);

    return (
        <header className="bg-slate-950 text-slate-100 shadow-lg border-b border-slate-700">
            <div className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex-1">
                    {isEditingName ? (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                className="px-3 py-1 rounded text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-100"
                                autoFocus
                                onBlur={handleSaveName}
                                onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
                            />
                        </div>
                    ) : (
                        <div
                            onClick={() => setIsEditingName(true)}
                            className="cursor-pointer group"
                        >
                            <h1 className="text-xl font-semibold group-hover:text-slate-300 transition-colors">
                                {projectName}
                            </h1>
                            <p className="text-slate-400 text-xs">Clique para editar o nome</p>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {selectedNodeId && (
                        <button
                            onClick={() => {
                                console.log('Delete button clicked, selectedNodeId:', selectedNodeId);
                                deleteNode(selectedNodeId);
                            }}
                            className="flex items-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-500 rounded transition-colors font-medium text-xs text-white border border-yellow-700 hover:border-yellow-600"
                            title="Apagar node selecionado"
                        >
                            <Trash2 size={16} />
                            <span className="hidden sm:inline">Apagar Selecionado</span>
                        </button>
                    )}
                    <button
                        onClick={onShowStats}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors font-medium text-xs text-slate-100 border border-slate-600 hover:border-slate-500"
                        title="Ver estatísticas"
                    >
                        <BarChart3 size={16} />
                        <span className="hidden sm:inline">Relatório</span>
                    </button>

                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-700 hover:bg-blue-600 rounded transition-colors font-medium text-xs text-white border border-blue-600 hover:border-blue-500"
                        title="Baixar projeto"
                    >
                        <Download size={16} />
                        <span className="hidden sm:inline">Exportar</span>
                    </button>

                    <button
                        onClick={handleClear}
                        className="flex items-center gap-2 px-3 py-2 bg-red-700 hover:bg-red-600 rounded transition-colors font-medium text-xs text-white border border-red-600 hover:border-red-500"
                        title="Limpar projeto"
                    >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">Limpar</span>
                    </button>
                </div>
            </div>

            <div className="px-6 py-3 bg-slate-900 text-slate-300 text-sm flex gap-6 flex-wrap border-t border-slate-700">
                <div className="flex items-center gap-2">
                    <span className="text-slate-400">Etapas:</span>
                    <span className="font-semibold text-slate-100">{nodes.length}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-slate-400">Conexões:</span>
                    <span className="font-semibold text-slate-100">{edges.length}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-slate-400">Visitantes:</span>
                    <span className="font-semibold text-cyan-400">{totalVisitors.toLocaleString()}</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
