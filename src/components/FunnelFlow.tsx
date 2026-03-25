import React, { useCallback, useMemo, useEffect, useRef } from 'react';
import ReactFlow, {
    addEdge,
    useNodesState,
    useEdgesState,
    Background,
    Controls,
    MiniMap,
} from 'reactflow';
import type {
    Node,
    Edge,
    Connection,
    NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';

import FunnelNode from './FunnelNode';
import { useFunnelStore } from '../store/funnelStore';

interface FunnelFlowProps {
    onNodeDelete: (id: string) => void;
    onNodeEdit: () => void;
}

const FunnelFlow: React.FC<FunnelFlowProps> = ({ onNodeDelete, onNodeEdit }) => {
    // state: recupera dados da store e funções para atualizar
    const { nodes: storeNodes, edges: storeEdges, updateNodePosition, addEdge: addEdgeToStore, setSelectedNodeId, selectedNodeId } = useFunnelStore();

    // refs: mantém callbacks atualizadas sem causar re-renders infinitos
    const onNodeDeleteRef = useRef(onNodeDelete);
    const onNodeEditRef = useRef(onNodeEdit);

    // sincroniza refs com callbacks novos
    useEffect(() => {
        onNodeDeleteRef.current = onNodeDelete;
    }, [onNodeDelete]);

    useEffect(() => {
        onNodeEditRef.current = onNodeEdit;
    }, [onNodeEdit]);

    // converte para React Flow: transforma dados da store em formato que React Flow entende
    // memoizado para não recalcular desnecessariamente
    const reactFlowNodes: Node[] = useMemo(() => {
        console.log('reactFlowNodes recalculando com', storeNodes.length, 'nós');
        return storeNodes.map((node) => ({
            id: node.id,
            type: 'funnelNode',
            data: {
                ...node.data,
                onDelete: (id: string) => onNodeDeleteRef.current(id),
                onEdit: () => onNodeEditRef.current(),
            },
            position: node.position,
            selected: node.id === selectedNodeId,
        }));
    }, [storeNodes, selectedNodeId]);

    const reactFlowEdges: Edge[] = useMemo(
        () =>
            storeEdges.map((edge) => ({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                animated: true,
                style: {
                    strokeWidth: 2,
                },
            })),
        [storeEdges]
    );

    // react flow hooks: gerencia estado interno do React Flow
    const [nodes, setNodes, onNodesChange] = useNodesState(reactFlowNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(reactFlowEdges);

    // sincronizar: quando dados da store mudam, atualiza React Flow
    // a store é a fonte de verdade, React Flow é apenas visualização
    useEffect(() => {
        console.log('atualizando nós, reactFlowNodes count:', reactFlowNodes.length);
        setNodes(reactFlowNodes);
    }, [reactFlowNodes, setNodes]);

    useEffect(() => {
        console.log('atualizando edges, reactFlowEdges count:', reactFlowEdges.length);
        setEdges(reactFlowEdges);
    }, [reactFlowEdges, setEdges]);

    const nodeTypes: NodeTypes = useMemo(
        () => ({
            funnelNode: FunnelNode as any,
        }),
        []
    );

    // mudanças de posição: quando usuário arrasta um nó
    // importante: ignora eventos "remove" - a store controla a existência dos nós
    const handleNodesChange = useCallback(
        (changes: any) => {
            // ignora "remove" e "delete" types - store controla existência de nós
            // processa apenas atualizações de posição e ignora mudanças de seleção
            const validChanges = changes.filter((change: any) => {
                // pula remove/delete events - store controla isso
                if (change.type === 'remove' || change.type === 'delete') {
                    return false;
                }

                if (change.type === 'position') {
                    // verifica se nó existe antes de permitir mudança de posição
                    const nodeExists = storeNodes.some((n) => n.id === change.id);
                    if (!nodeExists) {
                        return false;
                    }
                    return true;
                }

                // ignora mudanças de seleção - manipulamos via setSelectedNodeId
                if (change.type === 'select') {
                    return false;
                }

                // permite outros tipos de mudança
                return true;
            });

            // só chama onNodesChange se houver mudanças válidas
            if (validChanges.length > 0) {
                onNodesChange(validChanges);
            }

            // atualiza store na mudança de posição
            validChanges.forEach((change: any) => {
                if (change.type === 'position' && change.position) {
                    updateNodePosition(change.id, change.position);
                }
            });
        },
        [onNodesChange, updateNodePosition, storeNodes]
    );

    // conectar: quando usuário arrasta uma linha entre nós
    const onConnect = useCallback(
        (connection: Connection) => {
            if (connection.source && connection.target) {
                addEdgeToStore(connection.source, connection.target);
                setEdges((eds) =>
                    addEdge(
                        {
                            ...connection,
                            animated: true,
                            style: {
                                strokeWidth: 2,
                            },
                        },
                        eds
                    )
                );
            }
        },
        [setEdges, addEdgeToStore]
    );

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={(event, node) => {
                event.stopPropagation();
                // Always verify node exists in store before any operation
                const nodeStillExists = storeNodes.some((n) => n.id === node.id);
                if (nodeStillExists) {
                    setSelectedNodeId(node.id);
                } else {
                    // If node was deleted, clear selection
                    setSelectedNodeId(null);
                }
            }}
            onPaneClick={(event) => {
                event.stopPropagation();
                setSelectedNodeId(null);
            }}
            fitView
        >
            <Background color="#334155" gap={16} />
            <Controls />
            <MiniMap />
        </ReactFlow>
    );
};

export default FunnelFlow;
