import type { Report } from "@sentinel/domain";
import { AstParserEngine } from "../parser/src/astParser";
import { SemanticEngine } from "../semantic/src/semanticEngine";
import { AssumptionEngine } from "../assumptions/src/assumptionEngine";
import { RuleEngine } from "../rules/src/ruleEngine";
import { ScoringEngine } from "../scoring/src/scoringEngine";
import { ReportEngine } from "../report/src/reportEngine";

export interface ScanInput {
  filePath: string;
  sourceCode: string;
}

export class ReasoningEngine {
  private parserEngine = new AstParserEngine();
  private semanticEngine = new SemanticEngine();
  private assumptionEngine = new AssumptionEngine();
  private ruleEngine = new RuleEngine();
  private scoringEngine = new ScoringEngine();
  private reportEngine = new ReportEngine();

  public analyze(input: ScanInput): Report {
    const { filePath, sourceCode } = input;

    // Stage 1: Parse AST Evidence using TypeScript compiler API
    const parseResult = this.parserEngine.parse(filePath, sourceCode);

    // Stage 2: Form Observations from Evidence
    const observations = this.semanticEngine.analyze(filePath, parseResult.evidences);

    // Stage 3: Infer Engineering Assumptions
    const assumptions = this.assumptionEngine.inferAssumptions(observations);

    // Stage 4: Evaluate Rules & Project Risks
    const { findings } = this.ruleEngine.evaluateRules(assumptions, parseResult.evidences);

    // Stage 5: Calculate Readiness Score
    const score = this.scoringEngine.calculateScore(findings);

    // Stage 6: Generate Recommendations, Test Scenarios & Final Report
    const { report } = this.reportEngine.generateReport(filePath, findings, score);

    return report;
  }
}
