export interface FunnelMetrics {
    visitors: number;
    conversionRate: number;
    avgTimeOnPage: number; // in seconds
    bounceRate: number;
}

export interface FunnelStage {
    id: string;
    label: string;
    type: 'ad' | 'landing' | 'form' | 'checkout' | 'thank-you' | 'custom';
    color: string;
    metrics: FunnelMetrics;
    description?: string;
}

export interface FunnelNode {
    id: string;
    data: FunnelStage;
    position: { x: number; y: number };
}

export interface FunnelEdge {
    id: string;
    source: string;
    target: string;
}

export interface FunnelProject {
    id: string;
    name: string;
    nodes: FunnelNode[];
    edges: FunnelEdge[];
    createdAt: number;
    updatedAt: number;
}
