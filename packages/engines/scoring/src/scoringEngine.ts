import type { Finding } from "@sentinel/domain";

export class ScoringEngine {
  public calculateScore(findings: Finding[]): number {
    let score = 100;

    findings.forEach((fnd) => {
      if (fnd.severity === "CRITICAL") {
        score -= 30;
      } else if (fnd.severity === "HIGH") {
        score -= 20;
      } else if (fnd.severity === "MEDIUM") {
        score -= 10;
      } else if (fnd.severity === "LOW") {
        score -= 5;
      }
    });

    return Math.max(0, score);
  }
}
