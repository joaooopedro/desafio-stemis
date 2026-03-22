import { create } from 'zustand';
import type { FunnelStage, FunnelNode, FunnelEdge, FunnelProject } from '../types';

interface FunnelStore {
    // State
    nodes: FunnelNode[];
    edges: FunnelEdge[];
    selectedNodeId: string | null;
    projectName: string;

    // Node operations
    addNode: (stage: FunnelStage, position: { x: number; y: number }) => void;
    updateNode: (id: string, stage: Partial<FunnelStage>) => void;
    deleteNode: (id: string) => void;
    setSelectedNodeId: (id: string | null) => void;

    // Edge operations
    addEdge: (source: string, target: string) => void;
    deleteEdge: (edgeId: string) => void;

    // Project operations
    updateProjectName: (name: string) => void;
    clearProject: () => void;
    loadProject: (project: FunnelProject) => void;

    // Position updates (from React Flow)
    updateNodePosition: (id: string, position: { x: number; y: number }) => void;
}

export const useFunnelStore = create<FunnelStore>((set) => {
    // Load from localStorage on initialization
    const savedData = localStorage.getItem('funnelData');
    const initialData = savedData ? JSON.parse(savedData) : null;

    // Default funnel stages if no data saved
    const defaultNodes: FunnelNode[] = [
        {
            id: 'node-default-1',
            position: { x: 50, y: 200 },
            data: {
                id: 'node-default-1',
                label: 'Google Ads',
                type: 'ad',
                color: '#3b82f6',
                metrics: {
                    visitors: 15420,
                    conversionRate: 8.5,
                    avgTimeOnPage: 45,
                    bounceRate: 25.3,
                },
            },
        },
        {
            id: 'node-default-2',
            position: { x: 300, y: 200 },
            data: {
                id: 'node-default-2',
                label: 'Landing Page',
                type: 'landing',
                color: '#8b5cf6',
                metrics: {
                    visitors: 12850,
                    conversionRate: 34.2,
                    avgTimeOnPage: 120,
                    bounceRate: 16.8,
                },
            },
        },
        {
            id: 'node-default-3',
            position: { x: 550, y: 200 },
            data: {
                id: 'node-default-3',
                label: 'Página de Produto',
                type: 'form',
                color: '#ec4899',
                metrics: {
                    visitors: 12420,
                    conversionRate: 42.1,
                    avgTimeOnPage: 95,
                    bounceRate: 12.4,
                },
            },
        },
        {
            id: 'node-default-4',
            position: { x: 800, y: 200 },
            data: {
                id: 'node-default-4',
                label: 'Carrinho de Compras',
                type: 'checkout',
                color: '#f59e0b',
                metrics: {
                    visitors: 5240,
                    conversionRate: 28.5,
                    avgTimeOnPage: 65,
                    bounceRate: 32.1,
                },
            },
        },
        {
            id: 'node-default-5',
            position: { x: 1050, y: 200 },
            data: {
                id: 'node-default-5',
                label: 'Pagamento',
                type: 'checkout',
                color: '#f59e0b',
                metrics: {
                    visitors: 4925,
                    conversionRate: 89.3,
                    avgTimeOnPage: 40,
                    bounceRate: 8.2,
                },
            },
        },
        {
            id: 'node-default-6',
            position: { x: 1300, y: 200 },
            data: {
                id: 'node-default-6',
                label: 'Confirmação de Pedido',
                type: 'thank-you',
                color: '#10b981',
                metrics: {
                    visitors: 4398,
                    conversionRate: 100,
                    avgTimeOnPage: 20,
                    bounceRate: 2.1,
                },
            },
        },
    ];

    const defaultEdges: FunnelEdge[] = [
        { id: 'edge-1-2', source: 'node-default-1', target: 'node-default-2' },
        { id: 'edge-2-3', source: 'node-default-2', target: 'node-default-3' },
        { id: 'edge-3-4', source: 'node-default-3', target: 'node-default-4' },
        { id: 'edge-4-5', source: 'node-default-4', target: 'node-default-5' },
        { id: 'edge-5-6', source: 'node-default-5', target: 'node-default-6' },
    ];

    return {
        // Initial state
        nodes: initialData?.nodes || defaultNodes,
        edges: initialData?.edges || defaultEdges,
        selectedNodeId: null,
        projectName: initialData?.projectName || 'Funil de E-commerce',

        addNode: (stage, position) => {
            const id = `node-${Date.now()}`;
            const newNode: FunnelNode = {
                id,
                position,
                data: {
                    ...stage,
                    id,
                },
            };

            set((state) => {
                const newState = {
                    nodes: [...state.nodes, newNode],
                    edges: state.edges,
                    selectedNodeId: state.selectedNodeId,
                    projectName: state.projectName,
                };
                saveToLocalStorage(newState);
                return newState;
            });
        },

        updateNode: (id, updates) => {
            set((state) => {
                const newNodes = state.nodes.map((node) =>
                    node.id === id
                        ? {
                            ...node,
                            data: { ...node.data, ...updates },
                        }
                        : node
                );
                const newState = {
                    nodes: newNodes,
                    edges: state.edges,
                    selectedNodeId: state.selectedNodeId,
                    projectName: state.projectName,
                };
                saveToLocalStorage(newState);
                return newState;
            });
        },

        deleteNode: (id) => {
            console.log('🗑️ deleteNode called with id:', id);
            set((state) => {
                console.log('Before delete - nodes count:', state.nodes.length, 'edges count:', state.edges.length);
                const newNodes = state.nodes.filter((node) => node.id !== id);
                const newEdges = state.edges.filter(
                    (edge) => edge.source !== id && edge.target !== id
                );
                console.log('After delete - nodes count:', newNodes.length, 'edges count:', newEdges.length);

                // Clear selection if the deleted node was selected
                const newSelectedNodeId = state.selectedNodeId === id ? null : state.selectedNodeId;

                const newState = {
                    nodes: newNodes,
                    edges: newEdges,
                    selectedNodeId: newSelectedNodeId,
                    projectName: state.projectName,
                };
                console.log('Saving to localStorage, newState nodes:', newState.nodes.length);
                saveToLocalStorage(newState);
                return newState;
            });
        },

        setSelectedNodeId: (id) => {
            set((state) => ({
                ...state,
                selectedNodeId: id,
            }));
        },

        addEdge: (source, target) => {
            const edgeId = `edge-${source}-${target}`;
            set((state) => {
                // Prevent duplicate edges
                if (state.edges.some((e) => e.source === source && e.target === target)) {
                    return state;
                }

                const newEdges = [
                    ...state.edges,
                    { id: edgeId, source, target },
                ];
                const newState = {
                    nodes: state.nodes,
                    edges: newEdges,
                    selectedNodeId: state.selectedNodeId,
                    projectName: state.projectName,
                };
                saveToLocalStorage(newState);
                return newState;
            });
        },

        deleteEdge: (edgeId) => {
            set((state) => {
                const newEdges = state.edges.filter((e) => e.id !== edgeId);
                const newState = {
                    nodes: state.nodes,
                    edges: newEdges,
                    selectedNodeId: state.selectedNodeId,
                    projectName: state.projectName,
                };
                saveToLocalStorage(newState);
                return newState;
            });
        },

        updateProjectName: (name) => {
            set((state) => {
                const newState = {
                    nodes: state.nodes,
                    edges: state.edges,
                    selectedNodeId: state.selectedNodeId,
                    projectName: name,
                };
                saveToLocalStorage(newState);
                return newState;
            });
        },

        clearProject: () => {
            set(() => {
                localStorage.removeItem('funnelData');
                return {
                    nodes: [],
                    edges: [],
                    selectedNodeId: null,
                    projectName: 'Meu Funil de Campanhas',
                };
            });
        },

        loadProject: (project) => {
            set(() => ({
                nodes: project.nodes,
                edges: project.edges,
                selectedNodeId: null,
                projectName: project.name,
            }));
        },

        updateNodePosition: (id, position) => {
            set((state) => {
                const newNodes = state.nodes.map((node) =>
                    node.id === id ? { ...node, position } : node
                );
                const newState = {
                    nodes: newNodes,
                    edges: state.edges,
                    selectedNodeId: state.selectedNodeId,
                    projectName: state.projectName,
                };
                saveToLocalStorage(newState);
                return newState;
            });
        },
    };
});

const saveToLocalStorage = (state: {
    nodes: FunnelNode[];
    edges: FunnelEdge[];
    projectName: string;
}) => {
    localStorage.setItem('funnelData', JSON.stringify(state));
};
