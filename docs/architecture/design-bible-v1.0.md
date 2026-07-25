# Sentinel Design Bible (Version 1.0)
## Technical Design Specification & Architecture Blueprint

---

## Executive Summary & Design Scope

Sentinel is a **Production Readiness Intelligence Platform**. Unlike traditional static analysis tools (linters, AST pattern matchers, SAST scanners) that evaluate code for syntactic correctness or known security CVE signatures, Sentinel models how an experienced principal engineer evaluates software prior to deployment. 

Sentinel’s fundamental axiom is:
> **Every production incident originates from an unvalidated engineering assumption.**

Code is merely evidence. Assumptions are the true source of production failure. Sentinel extracts code evidence, interprets observations, infers engineering assumptions, evaluates those assumptions against structured engineering knowledge via its core **Reasoning Engine**, and projects production risks along with actionable recommendations and verifiable test scenarios.

This document serves as the frozen **Version 1.0 Engineering Contract** for Sentinel.

---

# Part I — Product Vision

### 1.1 The Fundamental Problem
Modern software development velocity has accelerated dramatically due to cloud-native ecosystems, automated CI/CD, and AI-assisted code generation. However, code volume does not correlate with production stability. Current quality tools operate at the syntax or static analysis layer:
- **Linters** verify syntax formatting, import cleanliness, and superficial style.
- **SAST tools** look for known vulnerability signatures (e.g., SQL injection strings).
- **Test coverage tools** measure line execution, not edge-case resilience under adverse conditions.

None of these tools answer the critical questions asked during a human senior review:
1. *What implicit assumptions does this code make about its runtime environment?*
2. *Which of those assumptions are dangerous under race conditions, network failures, or state mutations?*
3. *What specific failure mode will occur in production if this assumption breaks?*
4. *How can the developer modify the architecture to remove the dangerous assumption?*
5. *What realistic test scenario will validate the resilience of the fix?*

### 1.2 Production Readiness Intelligence (PRI)
Sentinel creates a new category: **Production Readiness Intelligence (PRI)**. PRI shifts the focus of automated code analysis from *syntax correctness* to *runtime assumption analysis*.

```
Traditional Analysis:  Syntax/AST  ──────►  Rule Matching  ──────►  Line-Level Error
Sentinel PRI:          Code Evidence ──►  Observation ──► Assumptions ──► Reasoning Engine ──► Production Risk + Test Plan
```

### 1.3 Differentiation Matrix

| Metric / Dimension | Traditional Linters (ESLint, Prettier) | SAST & Security (Semgrep, Snyk, CodeQL) | Quality Dashboards (SonarQube) | **Sentinel (PRI Platform)** |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Unit of Analysis** | Syntax tokens & AST nodes | Code pattern matches & vulnerability DBs | Cyclomatic complexity & code smell counts | **Implicit Engineering Assumptions** |
| **Evaluation Mechanism** | AST rules | Regular expressions & taint graphs | Metric thresholds & static heuristics | **Reasoning Engine (Knowledge Evaluation)** |
| **Output Type** | Style warnings & syntax errors | CVE alerts & vulnerability locations | Quality gate pass/fail scores | **Production Risk, Remediation Rationale & Test Scenarios** |
| **Contextual Depth** | Single file scope | Call graph taint analysis | Repository summary statistics | **Cross-file semantic dependency & assumption graph** |
| **Core Question Asked** | "Is this code formatted correctly?" | "Does this match a known vulnerability pattern?" | "Does this code violate quality metrics?" | **"What implicit assumption will break in production?"** |

### 1.4 What Sentinel Will Never Become
To preserve engineering focus and prevent scope creep, Sentinel explicitly rejects the following identities:
- **Sentinel will never be an IDE replacement or code editor.**
- **Sentinel will never be an AI code generator or auto-completer.**
- **Sentinel will never be a runtime monitoring / APM observability tool (e.g., Datadog).**
- **Sentinel will never be a general-purpose linting utility.**

---

# Part II — Product Principles

The design and implementation of Sentinel are guided by seven immutable engineering axioms:

1. **Code is Evidence, Not Truth**: Source code is merely physical evidence of intended behavior. The truth lies in the runtime environment and human assumptions.
2. **Assumptions cause Production Failures**: Incidents rarely occur because syntax was invalid; they occur because assumptions regarding network stability, state isolation, concurrency, or execution order failed.
3. **Reasoning Over Matching**: AST matching is trivial. The platform must reason about the interaction between inferred assumptions and engineering principles.
4. **Recommendations Must Explain Why**: Every recommendation produced by Sentinel must state the underlying mechanism of failure and the rationale for the fix.
5. **Every Finding Must Be Reproducible**: A finding must link deterministically back to verified code evidence and semantic observation chain.
6. **Every Recommendation Must Be Testable**: Sentinel must generate concrete, realistic test scenarios (e.g., network throttle, rapid navigation, state race) that validate recommendations.
7. **Every Risk Must Be Quantified**: Production risk must reflect severity, blast radius, and likelihood of failure in real-world environments.

---

# Part III — Product Scope

### 3.1 Target Technology Roadmap

```
  ┌───────────────────────────────────────────────────────────┐
  │                        MVP (v1.0)                         │
  │     Language: TypeScript, JavaScript                      │
  │     Ecosystems: React (UI), Node.js (Runtime)             │
  └─────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
  ┌───────────────────────────────────────────────────────────┐
  │                       Version 2.0                         │
  │     Ecosystems: Next.js (Fullstack), Express, NestJS      │
  └─────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
  ┌───────────────────────────────────────────────────────────┐
  │                       Version 3.0                         │
  │     Languages: Python, Java, Go                           │
  │     Frameworks: Angular, Vue, Spring Boot, FastAPI        │
  └───────────────────────────────────────────────────────────┘
```

### 3.2 Explicit Non-Goals
The following features are intentionally out of scope for Sentinel v1.0:
- Auto-fixing or auto-committing code directly to repositories without developer interaction.
- In-memory execution tracing via runtime bytecode manipulation.
- Replacement of CI/CD orchestration tools (GitHub Actions, Jenkins).
- Ingesting production log streams or APM trace data in real-time.

---

# Part IV — System Architecture (HLD)

### 4.1 System Context Diagram
The overall environment in which Sentinel operates:

```
                  ┌──────────────────────────────────────────────┐
                  │                 Developer                    │
                  └──────┬──────────────────────────────▲────────┘
                         │ Invokes Scan                 │ Views Report
                         ▼                              │
┌───────────────────────────────────────────────────────────────────────────────┐
│                           Sentinel Platform                                   │
│  ┌──────────────┐      ┌─────────────────────────┐      ┌──────────────────┐  │
│  │  CLI App     │─────►│ Core Analysis Engine    │─────►│ Dashboard App    │  │
│  └──────────────┘      │ (Reasoning & Pipeline)  │      └──────────────────┘  │
│                        └────────────┬────────────┘                            │
└─────────────────────────────────────┼─────────────────────────────────────────┘
                                      │ Ingests Code
                                      ▼
                        ┌───────────────────────────┐
                        │     Target Repository     │
                        └───────────────────────────┘
```

### 4.2 High-Level Architecture (The Reasoning Engine Paradigm)

The core architecture centers around the **Reasoning Engine**, replacing standard rule-matching scripts with a unified reasoning pipeline:

```
 ┌─────────────────┐
 │ Source Code     │
 └────────┬────────┘
          │
          ▼
 ┌─────────────────┐
 │   Parser        │ ──► AST Generation & Symbol Normalization
 └────────┬────────┘
          │
          ▼
 ┌─────────────────┐
 │ Semantic Model  │ ──► Code Graph, Call Graph, Dependency Mapping
 └────────┬────────┘
          │
          ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                              REASONING ENGINE                                 │
│                                                                               │
│  ┌────────────────────────┐      ┌────────────────────────┐                   │
│  │  Assumption Analysis   │─────►│    Rule Evaluation     │                   │
│  │ (Evidence ─► Inferences│      │  (Evaluates Principles)│                   │
│  └───────────┬────────────┘      └───────────┬────────────┘                   │
│              │                               │                                │
│              ▼                               ▼                                │
│  ┌────────────────────────┐      ┌────────────────────────┐                   │
│  │    Risk Assessment     │─────►│ Recommendation Gen.    │                   │
│  │(Impact & Blast Radius) │      │ (Contextual Rationale) │                   │
│  └────────────────────────┘      └───────────┬────────────┘                   │
│                                              │                                │
│                                              ▼                                │
│                                  ┌────────────────────────┐                   │
│                                  │ Test Scenario Gen.     │                   │
│                                  │ (Validation Specs)     │                   │
│                                  └────────────────────────┘                   │
└──────────────────────────────────────┬────────────────────────────────────────┘
                                       │
                                       ▼
                            ┌─────────────────────┐
                            │ Final Report Engine │
                            └─────────────────────┘
```

---

# Part V — Repository Structure

The monorepo structure is frozen as follows:

```
sentinel/
├── apps/
│   ├── api/                  # REST/GraphQL API server for enterprise scans
│   ├── cli/                  # Command-line interface executable
│   └── dashboard/            # React/Next.js management & report dashboard
├── packages/
│   ├── configs/              # Shared TypeScript, ESLint, and Build configurations
│   ├── core/                 # Core orchestrator, pipeline execution, and worker threads
│   ├── domain/               # DDD domain models, interfaces, and value objects
│   ├── engines/              # Engine implementations (Parser, Semantic, Reasoning, Report)
│   ├── knowledge-base/       # Default taxonomies, rule definitions, anti-patterns
│   ├── plugins/              # Official plugins (React, Node, Next.js)
│   └── testing/              # Test utilities, golden AST fixtures, mock graphs
├── docs/
│   ├── adr/                  # Architecture Decision Records
│   └── architecture/         # Architectural documentation (Design Bible v1.0)
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

---

# Part VI — Domain Model (DDD)

Sentinel's domain model defines the progression from physical source files to actionable readiness intelligence.

```
Repository ──► Project ──► SourceFile ──► Evidence ──► Observation ──► Assumption ──► Finding ──► Risk ──► Recommendation ──► TestScenario ──► Report
```

### 6.1 Entity Definitions & Invariants

1. **Repository**: Root aggregate representing the codebase boundary.
   - *Invariant*: Must have a valid file system root path or remote origin.
2. **Project**: Deployable application/unit within a repository.
   - *Invariant*: Belongs to exactly one Repository.
3. **SourceFile**: Physical source file (TypeScript/JavaScript).
   - *Invariant*: Contains relative path, language mode, AST reference.
4. **Evidence**: Objective fact extracted directly from AST without interpretation (e.g. `useEffect` call, `await fetch`).
   - *Invariant*: Contains exact file location (fileId, line, column). Immutable.
5. **Observation**: Interpretation of relationships between multiple pieces of Evidence (e.g. `useEffect` has empty dependency array `[]`).
6. **Assumption**: Implicit operational expectation inferred from observations (e.g. "Developer assumes network request never fails").
7. **Finding**: Validated engineering concern occurring when an Assumption violates a Knowledge Rule.
8. **Risk**: Projected production impact (e.g. Memory Leak, Race Condition, Stale Closure).
9. **Recommendation**: Corrective engineering action containing detailed architectural rationale.
10. **TestScenario**: Step-by-step verification plan validating that the fix resolves the risk.
11. **Report**: Aggregated artifact holding findings, risks, recommendations, metrics, and readiness score.

---

# Part VII — Reasoning Engine & Sub-Engine Design

Sentinel's engine layer is divided into modular, clean sub-engines coordinated by the core Reasoning Engine.

### 7.1 Parser Engine
- **Input**: Raw source code strings / file paths.
- **Output**: Standardized AST Node graph & Symbol Tables.
- **Implementation**: Uses SWC / Babel TypeScript parsers with custom node visitor wrappers.

### 7.2 Semantic Engine
- **Input**: AST & Symbol Tables.
- **Output**: Code Graph (Call Graph, Import Graph, Data Flow Graph).
- **Responsibility**: Resolves module import boundaries, variable scoping, and function call references across files.

### 7.3 Reasoning Engine (Core)
The Reasoning Engine manages five sequential sub-phases:
1. **Assumption Sub-Engine**: Maps semantic observations to implicit assumptions using pattern inference.
2. **Rule Sub-Engine**: Evaluates assumptions against registered engineering principles in the Knowledge Base.
3. **Risk Sub-Engine**: Calculates severity, probability, and blast radius of broken assumptions to project specific failure scenarios.
4. **Recommendation Sub-Engine**: Generates contextual code fix recommendations with explicit rationale.
5. **Test Scenario Sub-Engine**: Generates test specs (network offline, rapid re-renders, race condition triggers) to verify resilience.

### 7.4 Scoring & Reporting Engine
- **Input**: Findings, Risks, and Metrics.
- **Output**: Readiness Score (0-100), domain breakdown scores (Security, Reliability, Performance), and structured `Report` artifact.

---

# Part VIII — Knowledge Base Architecture

The Knowledge Base codifies engineering wisdom into structured, executable entities:

### 8.1 Taxonomy
Categories of engineering readiness:
- `Security`: Authentication, authorization, input validation, secret safety.
- `Performance`: Re-renders, memory leaks, unindexed operations, payload size.
- `Reliability`: Error handling, retry logic, timeout protection, fallback availability.
- `State & Concurrency`: Race conditions, stale closures, mutating state directly.
- `Data Integrity`: Null/undefined safety, partial updates, schema mismatches.

### 8.2 Knowledge Structure
- **Rule**: Executable principle checking if an assumption is safe.
- **RuleSet**: Group of rules targeted at a framework (e.g. `ReactResilienceRuleSet`).
- **Pattern**: Recommended architectural design (e.g. `AbortController` cancellation).
- **AntiPattern**: Known failure-prone implementation pattern (e.g. `Unhandled Floating Promise`).
- **BestPractice**: High-level engineering guidelines for code structure.

---

# Part IX — Plugin Architecture

Plugins extend Sentinel's semantic observation and assumption rules for specific frameworks:

### 9.1 Supported Plugin Interfaces
- `SentinelPlugin`: Master interface defining plugin metadata, AST visitors, and assumption rules.
- `ReactPlugin`: Extends observation of hook dependencies, component lifecycles, and state mutations.
- `NodePlugin`: Extends observation of event loops, unhandled promise rejections, and stream backpressure.

### 9.2 Isolation & Loading
Plugins execute in sandboxed evaluation contexts. A plugin cannot modify global process state, perform external network calls, or write to the filesystem.

---

# Part X — Analysis Pipeline Execution

The lifecycle of a Sentinel analysis run:

```
[1. File Discovery] ──► Glob scanning & filter exclusions (.gitignore)
         │
         ▼
[2. AST Parsing]    ──► Concurrent SWC/Babel parsing to AST
         │
         ▼
[3. Graph Build]    ──► Symbol resolution & Code Graph linkage
         │
         ▼
[4. Evidence Extraction] ──► AST visitor collects raw evidence
         │
         ▼
[5. Observation Building] ─► Semantic Engine correlates evidence
         │
         ▼
[6. Assumption Inference] ─► Inferred expectations derived
         │
         ▼
[7. Reasoning Engine]     ─► Knowledge evaluation, risk projection, recommendation & test scenarios
         │
         ▼
[8. Report Generation]   ─► Score computation & report formatting (JSON/HTML/Markdown)
```

---

# Part XI — Internal Data Structures (LLD)

### 11.1 Code Graph Architecture
- **Node Types**: `FileNode`, `FunctionNode`, `ComponentNode`, `HookNode`, `VariableNode`.
- **Edge Types**: `IMPORTS`, `CALLS`, `USES_STATE`, `DEPENDS_ON`, `INSTANTIATES`.

### 11.2 Assumption Graph
Connects `EvidenceNode[]` ──► `ObservationNode` ──► `AssumptionNode` ──► `FindingNode` ──► `RiskNode`.

---

# Part XII — APIs & Interface Contracts

### 12.1 CLI Interface
```bash
sentinel scan [path] --config sentinel.config.json --format json|html|pretty --output report.json
```

### 12.2 REST API Contracts (Apps / API)
- `POST /api/v1/scans` : Submit a repository scan job.
- `GET /api/v1/scans/:id` : Fetch scan execution status and results.
- `GET /api/v1/reports/:id` : Fetch detailed report JSON.

---

# Part XIII — Storage & Persistence Strategy

- **Version 1.0 (Local / CLI)**: In-memory pipeline execution with optional JSON/HTML artifact output saved to `.sentinel/reports/`.
- **Version 2.0 (Enterprise / Server)**: SQLite / PostgreSQL database schemas for scan history, trending readiness scores, and rule configuration.

---

# Part XIV — Performance & Scalability

1. **Parallel AST Parsing**: Utilizes Node.js worker pools (`worker_threads`) to distribute file parsing across CPU cores.
2. **Incremental Scans**: Hash-based caching of unchanged source files to bypass AST re-parsing during development iterations.
3. **Memory Bounding**: Fixed heap allocations for AST trees with streaming garbage collection after Evidence extraction.

---

# Part XV — Security & Sandboxing

1. **Static Analysis Isolation**: Scans run purely statically without executing target source code.
2. **Rule Sandboxing**: Custom user rules operate in restricted VM contexts (`node:vm`) with no I/O access.
3. **Secret Safety**: AST evidence extractors automatically redact hardcoded string literals matching credential signatures.

---

# Part XVI — Testing Strategy

1. **Unit Testing**: 100% coverage on Reasoning Engine sub-engines and AST extractors.
2. **Golden AST Tests**: Snapshot tests comparing raw evidence extractions against golden AST fixtures.
3. **Integration Scans**: End-to-end analysis runs on curated open-source repositories (React apps, Node APIs).
4. **Mutation Testing**: Code mutation testing to verify that rules catch engineered assumption failures.

---

# Part XVII — Technical Roadmap

```
Milestone 1: Architecture Freeze & Domain Models (CURRENT)
Milestone 2: Parser & AST Visitor Infrastructure
Milestone 3: Semantic Engine & Code Graph Construction
Milestone 4: Assumption Inference Engine Implementation
Milestone 5: Reasoning Engine & Knowledge Evaluation
Milestone 6: Risk Assessment & Recommendation Generators
Milestone 7: Test Scenario Generation Engine
Milestone 8: CLI Executable & Formatting Output
Milestone 9: Dashboard & Visualization Application
Milestone 10: AI Reasoning Augmentation & Plugin Ecosystem
```

---

# Part XVIII — Architectural Decision Records (ADRs)

### ADR-001: Core Architecture Pivot to Reasoning Engine
- **Status**: Approved & Frozen.
- **Context**: Standard rule engines encourage AST pattern matching, producing shallow lint warnings.
- **Decision**: Centralize all analysis around a **Reasoning Engine** that evaluates inferred assumptions against engineering principles to generate risk, recommendations, and test scenarios.

### ADR-002: Monorepo Package Boundary Isolation
- **Status**: Approved & Frozen.
- **Context**: Mixing domain logic with CLI or parser details creates tight coupling.
- **Decision**: Strictly isolate `@sentinel/domain` from engine implementations (`@sentinel/engines`) and apps (`apps/cli`, `apps/api`).

---

# Part XIX — Engineering & Coding Standards

1. **TypeScript Usage**: Strict mode enabled (`"strict": true`). No use of `any`; explicit interfaces for all domain constructs.
2. **Immutability**: Domain models are immutable value objects.
3. **Error Handling**: Domain errors use typed custom Error classes (`AnalysisError`, `ParserError`, `ReasoningError`).
4. **Package Imports**: Packages may only import from `@sentinel/domain` or specified dependency layers. No circular package dependencies allowed.

---

# Part XX — Future Research & Deferred Exploration

1. **Cross-Repository Assumption Analysis**: Inferring assumptions across distributed microservices.
2. **Autonomous Rule Generation**: Using AI LLMs to analyze post-mortem incident reports and auto-generate Sentinel rules.
3. **Production Telemetry Feedback Loop**: Correlating Datadog/Sentry error rates back to static assumption scores.

---
*End of Sentinel Design Bible Version 1.0 — Document Frozen.*
