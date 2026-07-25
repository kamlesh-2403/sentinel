export interface RepositoryLoaded {
  repositoryId: string;
  path: string;
}

export interface FileParsed {
  fileId: string;
  path: string;
}

export interface SemanticAnalyzed {
  fileId: string;
  findingsCount: number;
}

export interface AssumptionGenerated {
  assumptionId: string;
  statement: string;
}

export interface RuleMatched {
  ruleId: string;
  findingId?: string;
}

export interface RiskCalculated {
  findingId: string;
  level: string;
}

export interface ReportGenerated {
  reportId: string;
  repositoryId?: string;
}
