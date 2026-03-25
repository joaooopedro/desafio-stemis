import { useState, useCallback, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FunnelFlow from './components/FunnelFlow';
import EditNodeModal from './components/EditNodeModal';
import StatsModal from './components/StatsModal';
import { useFunnelStore } from './store/funnelStore';
import type { FunnelStage } from './types';
import './index.css';

function App() {
  // estrutura principal: recupera estado global da store (Zustand)
  const { nodes, addNode, deleteNode, updateNode, selectedNodeId } = useFunnelStore();
  // modais: controla exibição dos formulários de edição e estatísticas
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // seleção: encontra o nó selecionado para edição
  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  // adicionar: callback para adicionar novo nó ao funil
  const handleAddNode = useCallback((stage: FunnelStage, position: { x: number; y: number }) => {
    addNode(stage, position);
  }, [addNode]);

  // deletar: remove nó selecionado e fecha o modal
  const handleDeleteNode = useCallback((id: string) => {
    console.log('App.handleDeleteNode called with id:', id);
    setShowEditModal(false);
    deleteNode(id);
  }, [deleteNode]);

  // editar: abre modal para edição
  const handleEditNode = useCallback(() => {
    setShowEditModal(true);
  }, []);

  // salvar: persiste alterações do nó na store
  const handleSaveNodeEdit = (updates: Partial<FunnelStage>) => {
    if (selectedNodeId) {
      updateNode(selectedNodeId, updates);
    }
  };

  // tecla delete: permite deletar nó pressionando a tecla Delete
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // so dispara se a tecla Delete for pressionada e um nó estiver selecionado
      if (event.key === 'Delete' && selectedNodeId) {
        console.log('Delete key pressed, deleting node:', selectedNodeId);
        event.preventDefault();
        handleDeleteNode(selectedNodeId);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [selectedNodeId, handleDeleteNode]);

  // sidebar: toggle para abrir/fechar sidebar em mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col bg-slate-950">
        <Header onShowStats={() => setShowStatsModal(true)} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex flex-1 overflow-hidden relative">
          {/* Sidebar Desktop */}
          <div className="hidden sm:block">
            <Sidebar onAddNode={handleAddNode} />
          </div>

          {/* Sidebar Mobile (Drawer) */}
          {sidebarOpen && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              {/* Mobile Sidebar */}
              <div className="fixed left-0 top-16 bottom-0 w-64 bg-slate-900 border-r border-slate-700 z-50 sm:hidden shadow-2xl">
                <Sidebar onAddNode={(stage, pos) => {
                  handleAddNode(stage, pos);
                  setSidebarOpen(false);
                }} />
              </div>
            </>
          )}

          <div className="flex-1 bg-slate-800">
            <FunnelFlow onNodeDelete={handleDeleteNode} onNodeEdit={handleEditNode} />
          </div>
        </div>

        {showEditModal && selectedNode && (
          <EditNodeModal
            node={selectedNode.data}
            onClose={() => setShowEditModal(false)}
            onSave={handleSaveNodeEdit}
          />
        )}

        {showStatsModal && (
          <StatsModal onClose={() => setShowStatsModal(false)} />
        )}
      </div>
    </ReactFlowProvider>
  );
}

export default App;
