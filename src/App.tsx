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
  const { nodes, addNode, deleteNode, updateNode, selectedNodeId } = useFunnelStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  const handleAddNode = useCallback((stage: FunnelStage, position: { x: number; y: number }) => {
    addNode(stage, position);
  }, [addNode]);

  const handleDeleteNode = useCallback((id: string) => {
    console.log('📝 App.handleDeleteNode called with id:', id);
    setShowEditModal(false);
    deleteNode(id);
  }, [deleteNode]);

  const handleEditNode = useCallback(() => {
    setShowEditModal(true);
  }, []);

  const handleSaveNodeEdit = (updates: Partial<FunnelStage>) => {
    if (selectedNodeId) {
      updateNode(selectedNodeId, updates);
    }
  };

  // Handle Delete key press to delete selected node
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only trigger if Delete key is pressed and a node is selected
      if (event.key === 'Delete' && selectedNodeId) {
        console.log('⌨️ Delete key pressed, deleting node:', selectedNodeId);
        event.preventDefault();
        handleDeleteNode(selectedNodeId);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [selectedNodeId, handleDeleteNode]);

  return (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col bg-slate-950">
        <Header onShowStats={() => setShowStatsModal(true)} />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar onAddNode={handleAddNode} />

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
