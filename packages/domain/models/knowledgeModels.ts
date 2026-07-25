export interface Rule {
    id: string;
    ruleId: string;
    title: string;
    description?: string;
    category: string;
    severity: string;
    status?: string;
    evidenceIds?: string[];
}

export interface RuleSet {
    id: string;
    name: string;
    description?: string;
    rules: Rule[];
}

export interface Pattern {
    id: string;
    name: string;
    description: string;
    category: string;
    examples?: string[];
}

export interface AntiPattern {
    id: string;
    name: string;
    description: string;
    category: string;
    consequences?: string[];
    remediation?: string;
}

export interface BestPractice {
    id: string;
    title: string;
    description: string;
    category: string;
    rationale?: string;
}

export interface Taxonomy {
    id: string;
    name: string;
    categories: Category[];
}

export interface Category {
    id: string;
    name: string;
    description?: string;
}
