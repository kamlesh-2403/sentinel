export interface Pipeline {
    id: string;
    name: string;
    description?: string;
    stages: Stage[];
}

export interface Stage {
    id: string;
    name: string;
    description?: string;
    order: number;
    enabled: boolean;
}

export interface ExecutionContext {
    id: string;
    pipelineId: string;
    repositoryId: string;
    startedAt: string;
    completedAt?: string;
    config?: Record<string, unknown>;
}

export interface Artifact {
    id: string;
    name: string;
    type: string;
    stageId: string;
    path?: string;
    content?: unknown;
    createdAt: string;
}

export interface ExecutionResult {
    id: string;
    pipelineId: string;
    contextId: string;
    status: 'pending' | 'running' | 'success' | 'failed' | 'cancelled';
    artifacts: Artifact[];
    errors?: string[];
    durationMs?: number;
}
