export interface Evidence {
  id: string;
  fileId?: string;
  snippet?: string;
  line?: number;
  column?: number;
  explanation?: string;
}

export interface Observation {
  id: string;
  title: string;
  description: string;
  evidenceIds: string[];
}

export interface Assumption {
  id: string;
  statement: string;
  confidence?: number;
  observationIds?: string[];
  createdBy?: string;
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: string;
  ruleId?: string;
  assumptionId?: string;
  evidenceIds: string[];
  line?: number;
  snippet?: string;
}

export interface Risk {
  id: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  findingId?: string;
  potentialImpact?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: string;
  rationale: string;
  findingId?: string;
}

export interface TestScenario {
  id: string;
  name: string;
  description?: string;
  recommendationId?: string;
  steps?: string[];
  projectId?: string;
}
