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
    const { nodes: storeNodes, edges: storeEdges, updateNodePosition, addEdge: addEdgeToStore, setSelectedNodeId, selectedNodeId } = useFunnelStore();

    // Keep refs to the latest callback functions
    const onNodeDeleteRef = useRef(onNodeDelete);
    const onNodeEditRef = useRef(onNodeEdit);

    // Update refs whenever callbacks change
    useEffect(() => {
        onNodeDeleteRef.current = onNodeDelete;
    }, [onNodeDelete]);

    useEffect(() => {
        onNodeEditRef.current = onNodeEdit;
    }, [onNodeEdit]);

    // Convert store data to React Flow format - MEMOIZED to prevent infinite renders
    const reactFlowNodes: Node[] = useMemo(() => {
        console.log('📦 reactFlowNodes useMemo - recalculating with', storeNodes.length, 'nodes');
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

    const [nodes, setNodes, onNodesChange] = useNodesState(reactFlowNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(reactFlowEdges);

    // Sync with store changes - always use store as source of truth
    // This is the ONLY place where nodes are updated from outside handlers
    useEffect(() => {
        console.log('FunnelFlow useEffect - updating nodes, reactFlowNodes count:', reactFlowNodes.length);
        setNodes(reactFlowNodes);
    }, [reactFlowNodes, setNodes]);

    useEffect(() => {
        console.log('FunnelFlow useEffect - updating edges, reactFlowEdges count:', reactFlowEdges.length);
        setEdges(reactFlowEdges);
    }, [reactFlowEdges, setEdges]);

    const nodeTypes: NodeTypes = useMemo(
        () => ({
            funnelNode: FunnelNode as any,
        }),
        []
    );

    // Handle node position changes - DON'T process "remove" events from React Flow
    // They cause ghost nodes. Only handle position and ignore delete/remove events.
    const handleNodesChange = useCallback(
        (changes: any) => {
            // IMPORTANT: Ignore "remove" and "delete" types - store controls node existence
            // Only process position updates and ignore selection changes
            const validChanges = changes.filter((change: any) => {
                // Skip remove/delete events entirely - store controls this
                if (change.type === 'remove' || change.type === 'delete') {
                    return false;
                }

                if (change.type === 'position') {
                    // Verify node exists before allowing position change
                    const nodeExists = storeNodes.some((n) => n.id === change.id);
                    if (!nodeExists) {
                        return false;
                    }
                    return true;
                }

                // Ignore select changes - we handle selection via setSelectedNodeId
                if (change.type === 'select') {
                    return false;
                }

                // Allow other changes
                return true;
            });

            // Only call onNodesChange if there are valid changes
            if (validChanges.length > 0) {
                onNodesChange(validChanges);
            }

            // Update store on position change
            validChanges.forEach((change: any) => {
                if (change.type === 'position' && change.position) {
                    updateNodePosition(change.id, change.position);
                }
            });
        },
        [onNodesChange, updateNodePosition, storeNodes]
    );

    // Handle connections
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
