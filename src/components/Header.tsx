import React, { useState } from 'react';
import { Download, Trash2, BarChart3, Menu } from 'lucide-react';
import { useFunnelStore } from '../store/funnelStore';

interface HeaderProps {
    onShowStats: () => void;
    onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowStats, onToggleSidebar }) => {
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
            <div className="px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
                <div className="flex gap-2 sm:gap-3 items-center">
                    {/* Menu Mobile */}
                    <button
                        onClick={onToggleSidebar}
                        className="sm:hidden p-2 hover:bg-slate-800 rounded transition-colors text-slate-100"
                    >
                        <Menu size={20} />
                    </button>
                </div>

                <div className="flex-1 min-w-0">
                    {isEditingName ? (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                className="px-2 sm:px-3 py-1 rounded text-slate-900 font-semibold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-100 w-full"
                                autoFocus
                                onBlur={handleSaveName}
                                onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
                            />
                        </div>
                    ) : (
                        <div
                            onClick={() => setIsEditingName(true)}
                            className="cursor-pointer group min-w-0"
                        >
                            <h1 className="text-lg sm:text-xl font-semibold group-hover:text-slate-300 transition-colors truncate">
                                {projectName}
                            </h1>
                            <p className="text-slate-400 text-xs hidden sm:block">Clique para editar</p>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1 sm:gap-3 flex-wrap justify-end">
                    {selectedNodeId && (
                        <button
                            onClick={() => {
                                console.log('Delete button clicked, selectedNodeId:', selectedNodeId);
                                deleteNode(selectedNodeId);
                            }}
                            className="p-2 sm:px-3 sm:py-2 bg-yellow-600 hover:bg-yellow-500 rounded transition-colors text-xs font-medium text-white border border-yellow-700 hover:border-yellow-600 flex items-center gap-1 sm:gap-2"
                            title="Apagar node selecionado"
                        >
                            <Trash2 size={16} />
                            <span className="hidden sm:inline">Apagar</span>
                        </button>
                    )}
                    <button
                        onClick={onShowStats}
                        className="p-2 sm:px-3 sm:py-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors text-xs font-medium text-slate-100 border border-slate-600 hover:border-slate-500 flex items-center gap-1 sm:gap-2"
                        title="Estatísticas"
                    >
                        <BarChart3 size={16} />
                        <span className="hidden sm:inline">Relatório</span>
                    </button>

                    <button
                        onClick={handleExport}
                        className="p-2 sm:px-3 sm:py-2 bg-blue-700 hover:bg-blue-600 rounded transition-colors text-xs font-medium text-white border border-blue-600 hover:border-blue-500 flex items-center gap-1 sm:gap-2"
                        title="Exportar"
                    >
                        <Download size={16} />
                        <span className="hidden sm:inline">Exportar</span>
                    </button>

                    <button
                        onClick={handleClear}
                        className="p-2 sm:px-3 sm:py-2 bg-red-700 hover:bg-red-600 rounded transition-colors text-xs font-medium text-white border border-red-600 hover:border-red-500 flex items-center gap-1 sm:gap-2"
                        title="Limpar"
                    >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">Limpar</span>
                    </button>
                </div>
            </div>

            <div className="px-3 sm:px-6 py-2 sm:py-3 bg-slate-900 text-slate-300 text-xs sm:text-sm flex gap-3 sm:gap-6 flex-wrap border-t border-slate-700">
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
