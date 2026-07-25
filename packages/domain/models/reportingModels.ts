import type { Finding, Recommendation } from "./analysis";

export interface Score {
    id: string;
    value: number;
    maxValue: number;
}

export interface Report {
    id: string;
    title: string;
    generatedAt: string;
    repositoryId?: string;
    summary?: Summary;
    sections: Section[];
    recommendationGroups?: RecommendationGroup[];
    statistics?: Statistics;
    metrics?: Metric[];
    findings?: Finding[];
    recommendations?: Recommendation[];
    score?: Score;
}

export interface Section {
    id: string;
    title: string;
    content?: string;
    metrics?: Metric[];
}

export interface Metric {
    id: string;
    name: string;
    value: number | string;
    unit?: string;
    category?: string;
}

export interface Summary {
    id: string;
    overview: string;
    totalFindings: number;
    totalRisks: number;
    score?: number;
}

export interface RecommendationGroup {
    id: string;
    category: string;
    recommendations: Recommendation[];
}

export interface Statistics {
    id: string;
    totalFilesAnalysed: number;
    totalRulesEvaluated: number;
    totalAssumptionsIdentified: number;
    totalFindingsDiscovered: number;
    totalRisksFound: number;
}
