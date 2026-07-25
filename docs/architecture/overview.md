# Sentinel Architecture & Reasoning Pipeline Overview

Sentinel is designed as a modular, 6-stage deterministic static analysis engine optimized for monorepos, React components, and Node.js microservices.

---

## 🏗️ Monorepo Package Structure

```text
sentinel/
├── apps/
│   ├── cli/             # Entry point for sentinel CLI & terminal runner
│   ├── api/             # HTTP API service for remote project scanning
│   └── dashboard/       # Visual Web Dashboard UI for readiness reports
├── packages/
│   ├── domain/          # Core TypeScript models, interfaces, and entities
│   ├── engines/         # Main ReasoningEngine pipeline & orchestrator
│   │   ├── parser/      # AST parsing & structural code evidence extraction
│   │   ├── semantic/    # Semantic observation derivation
│   │   ├── assumptions/ # Developer assumption inference engine
│   │   ├── rules/       # Production readiness rule evaluation engine
│   │   ├── scoring/     # Deterministic scoring algorithm
│   │   └── report/      # Report generation & recommendation synthesizer
│   ├── knowledge-base/  # Curated database of engineering patterns & risks
│   └── testing/         # E2E test utilities & fixture helpers
└── examples/            # Sample target applications (vulnerable & resilient)
```

---

## ⚡ The 6 Analysis Pipeline Stages

```text
[ Source File (.tsx / .ts) ]
            │
            ▼
┌──────────────────────┐
│  1. AstParserEngine  │  --> Scans code and extracts Evidences (Line #, Code Snippet)
└───────────┬──────────┘
            │
            ▼
┌──────────────────────┐
│  2. SemanticEngine   │  --> Transforms Evidences into Semantic Observations
└───────────┬──────────┘
            │
            ▼
┌──────────────────────┐
│3. AssumptionEngine   │  --> Infers Hidden Developer Assumptions
└───────────┬──────────┘
            │
            ▼
┌──────────────────────┐
│    4. RuleEngine     │  --> Evaluates Assumptions against Production Rules
└───────────┬──────────┘
            │
            ▼
┌──────────────────────┐
│   5. ScoringEngine   │  --> Computes Readiness Score [0 - 100]
└───────────┬──────────┘
            │
            ▼
┌──────────────────────┐
│   6. ReportEngine    │  --> Outputs Final Intelligence Report & Remediation Steps
└──────────────────────┘
```

### Stage Details

1. **`AstParserEngine`**: Reads source code line-by-line and AST constructs to generate structural `Evidence` objects containing file IDs, line numbers, and snippets.
2. **`SemanticEngine`**: Analyzes state closures, network calls, and I/O operations to form `Observation` models.
3. **`AssumptionEngine`**: Models the implicit mindset of the developer (e.g., assuming network calls never fail or state is always initialized).
4. **`RuleEngine`**: Evaluates observations against strict production rules (`REACT_HOOK_DEPENDENCY_RULE`, `SQL_INJECTION_PREVENTION_RULE`, etc.), assigning risk levels (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`).
5. **`ScoringEngine`**: Deducts points deterministically based on risk severity, producing an overall score `[0 - 100]`.
6. **`ReportEngine`**: Synthesizes actionable recommendations, remediation rationale, and step-by-step E2E verification test scenarios.
