import type { Finding, Recommendation, TestScenario, Report, Score } from "@sentinel/domain";

export class ReportEngine {
  public generateReport(
    filePath: string,
    findings: Finding[],
    scoreValue: number
  ): { recommendations: Recommendation[]; testScenarios: TestScenario[]; report: Report } {
    const recommendations: Recommendation[] = [];
    const testScenarios: TestScenario[] = [];

    findings.forEach((fnd) => {
      if (fnd.ruleId === "REACT_HOOK_DEPENDENCY_RULE") {
        const recId = `rec-hook-${fnd.id}`;
        recommendations.push({
          id: recId,
          title: "Include Closure Variables in Hook Dependencies",
          description: "Add all variables referenced inside callback into dependency array, or use AbortController for data fetching.",
          type: "REFACTOR",
          rationale: "Ensures hook re-triggers when props change and prevents stale closure state bugs.",
          findingId: fnd.id
        });

        testScenarios.push({
          id: `tst-hook-${fnd.id}`,
          name: "Rapid Prop Mutation Race Condition Test",
          description: "Mutate component props rapidly while async request is pending. Verify UI updates accurately.",
          recommendationId: recId,
          steps: [
            "Mount component with initial prop value 'A'",
            "Mutate prop value to 'B' after 50ms while request 'A' is pending",
            "Assert that request 'A' is aborted or ignored",
            "Assert UI displays data corresponding to prop 'B'"
          ]
        });
      }

      if (fnd.ruleId === "NETWORK_RESILIENCE_RULE") {
        const recId = `rec-net-${fnd.id}`;
        recommendations.push({
          id: recId,
          title: "Implement Explicit Error Handling & Fallback UI",
          description: "Wrap fetch network request in try/catch or append .catch() handler to display error state banner.",
          type: "RESILIENCE",
          rationale: "Protects application stability when server returns 5xx error or client is offline.",
          findingId: fnd.id
        });

        testScenarios.push({
          id: `tst-net-${fnd.id}`,
          name: "Offline / Server 500 Failure Resilience Test",
          description: "Mock network request to return HTTP 500. Verify error banner renders instead of crash.",
          recommendationId: recId,
          steps: [
            "Mock network response to return HTTP 500 Internal Server Error",
            "Mount target component",
            "Assert error banner renders with retry button",
            "Assert zero unhandled promise rejections"
          ]
        });
      }

      if (fnd.ruleId === "NULL_SAFETY_RULE") {
        const recId = `rec-null-${fnd.id}`;
        recommendations.push({
          id: recId,
          title: "Add Optional Chaining or Loading Guard",
          description: "Use optional chaining '?.' or render a loading guard if object is null.",
          type: "SAFETY",
          rationale: "Prevents runtime TypeError on initial render before asynchronous data resolves.",
          findingId: fnd.id
        });

        testScenarios.push({
          id: `tst-null-${fnd.id}`,
          name: "Initial Render Null Guard Test",
          description: "Mount component with unpopulated initial state. Assert component renders loading spinner without throwing error.",
          recommendationId: recId,
          steps: [
            "Mount component with initial state = null",
            "Assert loading skeleton/spinner is displayed",
            "Assert zero TypeError thrown during render phase"
          ]
        });
      }

      if (fnd.ruleId === "NODE_EVENT_LOOP_BLOCKING_RULE") {
        const recId = `rec-syncio-${fnd.id}`;
        recommendations.push({
          id: recId,
          title: "Migrate Synchronous I/O to Asynchronous Non-Blocking Promises",
          description: "Replace synchronous fs.readFileSync / execSync calls with fs.promises.readFile or async pipelines.",
          type: "PERFORMANCE",
          rationale: "Prevents single-threaded event loop thread starvation during concurrent HTTP server traffic.",
          findingId: fnd.id
        });
      }

      if (fnd.ruleId === "HARDCODED_SECRET_SECURITY_RULE") {
        const recId = `rec-secret-${fnd.id}`;
        recommendations.push({
          id: recId,
          title: "Extract Secrets into Environment Variables (.env)",
          description: "Move hardcoded credentials to process.env and inject via secure vault or environment variables.",
          type: "SECURITY",
          rationale: "Prevents unauthorized access and accidental credential leakage in version control.",
          findingId: fnd.id
        });
      }

      if (fnd.ruleId === "REACT_LIST_KEY_REORDERING_RULE") {
        const recId = `rec-key-${fnd.id}`;
        recommendations.push({
          id: recId,
          title: "Use Unique Entity ID for React List Keys",
          description: "Replace array index with unique entity identifier (e.g. item.id, item.uuid).",
          type: "REFACTOR",
          rationale: "Preserves component identity and local form state when list items are reordered or deleted.",
          findingId: fnd.id
        });
      }

      if (fnd.ruleId === "IMMUTABLE_STATE_MUTATION_RULE") {
        const recId = `rec-mutation-${fnd.id}`;
        recommendations.push({
          id: recId,
          title: "Use Immutable State Transformations",
          description: "Spread arrays/objects ([...state, newItem]) instead of mutating in-place (.push).",
          type: "SAFETY",
          rationale: "Ensures object reference equality changes, triggering React reconciliation and view updates.",
          findingId: fnd.id
        });
      }

      if (fnd.ruleId === "SILENT_ERROR_SWALLOWING_RULE") {
        const recId = `rec-catch-${fnd.id}`;
        recommendations.push({
          id: recId,
          title: "Log Caught Errors to Telemetry / Error Tracker",
          description: "Pass caught exception to logger (console.error, Sentry) or re-throw after failure handling.",
          type: "TELEMETRY",
          rationale: "Ensures production failures alert on-call developers rather than failing silently.",
          findingId: fnd.id
        });
      }

      if (fnd.ruleId === "NETWORK_TIMEOUT_BOUNDARY_RULE") {
        const recId = `rec-timeout-${fnd.id}`;
        recommendations.push({
          id: recId,
          title: "Configure Explicit HTTP Request Timeout",
          description: "Pass timeout option (e.g. { timeout: 5000 }) or AbortSignal.timeout(5000) to network requests.",
          type: "RESILIENCE",
          rationale: "Prevents hung backend sockets from consuming connection pools indefinitely.",
          findingId: fnd.id
        });
      }

      if (fnd.ruleId === "UNSAFE_TYPE_ASSERTION_RULE") {
        const recId = `rec-type-${fnd.id}`;
        recommendations.push({
          id: recId,
          title: "Replace 'as any' with Runtime Schema Validation",
          description: "Use Zod, TypeBox, or explicit type guards to validate external payloads at runtime.",
          type: "TYPE_SAFETY",
          rationale: "Ensures type safety extends to external API payloads and prevents unexpected runtime crashes.",
          findingId: fnd.id
        });
      }

      if (fnd.ruleId === "SQL_INJECTION_PREVENTION_RULE") {
        const recId = `rec-sql-${fnd.id}`;
        recommendations.push({
          id: recId,
          title: "Use Parameterized Queries or ORM Query Builders",
          description: "Replace string concatenation with parameterized SQL bindings (e.g. db.query('... $1', [val])).",
          type: "SECURITY",
          rationale: "Prevents attackers from executing arbitrary database commands via unsanitized input strings.",
          findingId: fnd.id
        });
      }

      if (fnd.ruleId === "MEMORY_LEAK_EVENT_LISTENER_RULE") {
        const recId = `rec-listener-${fnd.id}`;
        recommendations.push({
          id: recId,
          title: "Add Teardown Cleanup in useEffect / Event Handlers",
          description: "Return a cleanup function in useEffect to call removeEventListener / .off().",
          type: "MEMORY",
          rationale: "Frees heap memory when component unmounts, preventing progressive browser memory leaks.",
          findingId: fnd.id
        });
      }

      if (fnd.ruleId === "UNHANDLED_ASYNC_EVENT_HANDLER_RULE") {
        const recId = `rec-asynchandler-${fnd.id}`;
        recommendations.push({
          id: recId,
          title: "Wrap Async Event Handlers in try/catch Blocks",
          description: "Add error handling and loading resets inside async click and submit handlers.",
          type: "RESILIENCE",
          rationale: "Ensures form submit buttons reset out of pending state when network requests fail.",
          findingId: fnd.id
        });
      }

      if (fnd.ruleId === "FLOATING_POINT_CURRENCY_PRECISION_RULE") {
        const recId = `rec-currency-${fnd.id}`;
        recommendations.push({
          id: recId,
          title: "Use Integer Cents or Decimal Precision Libraries",
          description: "Perform financial calculations using integer cents (e.g. 1050 cents = $10.50) or dinero.js.",
          type: "PRECISION",
          rationale: "Eliminates IEEE 754 floating point precision artifacts in checkout and billing code.",
          findingId: fnd.id
        });
      }

      if (fnd.ruleId === "API_RATE_LIMITING_RULE") {
        const recId = `rec-ratelimit-${fnd.id}`;
        recommendations.push({
          id: recId,
          title: "Apply Rate Limiting Middleware to Express Endpoints",
          description: "Attach express-rate-limit middleware to public API routes.",
          type: "SECURITY",
          rationale: "Protects server infrastructure from automated brute force attacks and request flooding.",
          findingId: fnd.id
        });
      }
    });

    const score: Score = {
      id: `score-${Date.now()}`,
      value: scoreValue,
      maxValue: 100
    };

    const report: Report = {
      id: `report-${Date.now()}`,
      title: `Production Readiness Intelligence Report — ${filePath}`,
      generatedAt: new Date().toISOString(),
      repositoryId: "repo-sentinel-workspace",
      summary: {
        id: `sum-${Date.now()}`,
        overview: findings.length > 0 
          ? `WARNING: Discovered ${findings.length} unvalidated engineering assumptions posing production risk.`
          : "EXCELLENT: Code demonstrates high production readiness with zero unvalidated assumptions.",
        totalFindings: findings.length,
        totalRisks: findings.length,
        score: scoreValue
      },
      sections: [
        {
          id: "sec-1",
          title: "Assumption Analysis Breakdown",
          content: `Sentinel evaluated AST evidence and identified ${findings.length} dangerous engineering assumptions.`
        }
      ],
      recommendationGroups: [
        {
          id: "rg-1",
          category: "Resilience & Reliability",
          recommendations
        }
      ],
      statistics: {
        id: "stat-1",
        totalFilesAnalysed: 1,
        totalRulesEvaluated: 15,
        totalAssumptionsIdentified: findings.length,
        totalFindingsDiscovered: findings.length,
        totalRisksFound: findings.length
      },
      findings,
      recommendations,
      score
    };

    return { recommendations, testScenarios, report };
  }
}
