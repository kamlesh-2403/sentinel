import type { Evidence, Assumption, Finding, Risk } from "@sentinel/domain";

export class RuleEngine {
  public evaluateRules(
    assumptions: Assumption[],
    evidences: Evidence[] = []
  ): { findings: Finding[]; risks: Risk[] } {
    const findings: Finding[] = [];
    const risks: Risk[] = [];

    assumptions.forEach((asm) => {
      const lineMatch = asm.id.match(/-(\d+)$/);
      const line = lineMatch ? parseInt(lineMatch[1], 10) : undefined;
      const matchingEv = evidences.find((e) => e.line === line);
      const snippet = matchingEv?.snippet;

      // 1. React Hook Dependency Rule
      if (asm.id.startsWith("asm-hook-")) {
        const findingId = `fnd-hook-${asm.id}`;
        findings.push({
          id: findingId,
          title: "Stale Closure & Stale View Hazard",
          description: "Omitted hook dependency prevents component state from re-syncing when variables change.",
          severity: "HIGH",
          ruleId: "REACT_HOOK_DEPENDENCY_RULE",
          assumptionId: asm.id,
          evidenceIds: matchingEv ? [matchingEv.id] : [],
          line,
          snippet
        });

        risks.push({
          id: `risk-hook-${asm.id}`,
          level: "high",
          summary: "Stale State / Data Mismatch: Component displays outdated data after navigation or prop changes.",
          findingId,
          potentialImpact: "Users see incorrect data or private details belonging to another entity."
        });
      }

      // 2. Unhandled Network Boundary Rule
      if (asm.id.startsWith("asm-net-")) {
        const findingId = `fnd-net-${asm.id}`;
        findings.push({
          id: findingId,
          title: "Unhandled Network Failure Boundary",
          description: "Absence of error boundary exposes application to silent UI freeze or unhandled rejection.",
          severity: "CRITICAL",
          ruleId: "NETWORK_RESILIENCE_RULE",
          assumptionId: asm.id,
          evidenceIds: matchingEv ? [matchingEv.id] : [],
          line,
          snippet
        });

        risks.push({
          id: `risk-net-${asm.id}`,
          level: "critical",
          summary: "Application Freeze / Network Flakiness Hang: HTTP 5xx or offline status locks UI in loading state.",
          findingId,
          potentialImpact: "Application UI freezes completely on network failure."
        });
      }

      // 3. Null Safety Rule
      if (asm.id.startsWith("asm-null-")) {
        const findingId = `fnd-null-${asm.id}`;
        findings.push({
          id: findingId,
          title: "Null Dereference Crash Hazard",
          description: "Direct property access on uninitialized state variable throws runtime TypeError on render.",
          severity: "CRITICAL",
          ruleId: "NULL_SAFETY_RULE",
          assumptionId: asm.id,
          evidenceIds: matchingEv ? [matchingEv.id] : [],
          line,
          snippet
        });

        risks.push({
          id: `risk-null-${asm.id}`,
          level: "critical",
          summary: "White Screen of Death / Application Crash: Uncaught TypeError crashes component tree on mount.",
          findingId,
          potentialImpact: "100% of users experience broken UI on page load."
        });
      }

      // 4. Synchronous I/O Blocking Rule
      if (asm.id.startsWith("asm-syncio-")) {
        const findingId = `fnd-syncio-${asm.id}`;
        findings.push({
          id: findingId,
          title: "Synchronous Event Loop Blocking Hazard",
          description: "Executing synchronous file system I/O freezes the Node.js event loop thread for all active requests.",
          severity: "CRITICAL",
          ruleId: "NODE_EVENT_LOOP_BLOCKING_RULE",
          assumptionId: asm.id,
          evidenceIds: matchingEv ? [matchingEv.id] : [],
          line,
          snippet
        });

        risks.push({
          id: `risk-syncio-${asm.id}`,
          level: "critical",
          summary: "Server Response Latency Spike & Request Timeout: Concurrent users experience multi-second latency or gateway timeouts.",
          findingId,
          potentialImpact: "Server latency spikes massively, causing HTTP 504 Gateway Timeouts under concurrent load."
        });
      }

      // 5. Hardcoded Secret Security Rule
      if (asm.id.startsWith("asm-secret-")) {
        const findingId = `fnd-secret-${asm.id}`;
        findings.push({
          id: findingId,
          title: "Hardcoded Credential Security Leak",
          description: "Storing secrets directly in code exposes API keys and tokens in bundle artifacts and source control.",
          severity: "CRITICAL",
          ruleId: "HARDCODED_SECRET_SECURITY_RULE",
          assumptionId: asm.id,
          evidenceIds: matchingEv ? [matchingEv.id] : [],
          line,
          snippet
        });

        risks.push({
          id: `risk-secret-${asm.id}`,
          level: "critical",
          summary: "Credential Compromise & Unauthorized Access: Attackers extract keys from client JS or public git repositories.",
          findingId,
          potentialImpact: "Malicious actors gain full administrative API access or compromise production data."
        });
      }

      // 6. React List Key Reordering Rule
      if (asm.id.startsWith("asm-key-")) {
        const findingId = `fnd-key-${asm.id}`;
        findings.push({
          id: findingId,
          title: "Array Index Key Re-ordering State Corruption",
          description: "Using index as React key corrupts component local state and form input values when list items change.",
          severity: "MEDIUM",
          ruleId: "REACT_LIST_KEY_REORDERING_RULE",
          assumptionId: asm.id,
          evidenceIds: matchingEv ? [matchingEv.id] : [],
          line,
          snippet
        });

        risks.push({
          id: `risk-key-${asm.id}`,
          level: "medium",
          summary: "Form Input Desynchronization: Input field data attaches to wrong list items after deletion or sorting.",
          findingId,
          potentialImpact: "Users submit incorrect data in dynamic forms after re-ordering list items."
        });
      }

      // 7. Immutable State Mutation Rule
      if (asm.id.startsWith("asm-mutation-")) {
        const findingId = `fnd-mutation-${asm.id}`;
        findings.push({
          id: findingId,
          title: "Direct React State In-Place Mutation",
          description: "Mutating state objects directly breaks React shallow comparison and fails to trigger UI re-renders.",
          severity: "HIGH",
          ruleId: "IMMUTABLE_STATE_MUTATION_RULE",
          assumptionId: asm.id,
          evidenceIds: matchingEv ? [matchingEv.id] : [],
          line,
          snippet
        });

        risks.push({
          id: `risk-mutation-${asm.id}`,
          level: "high",
          summary: "Unresponsive UI State: User actions alter internal state, but UI fails to render updated content.",
          findingId,
          potentialImpact: "UI becomes non-responsive to user inputs, creating user confusion and broken workflows."
        });
      }

      // 8. Silent Error Swallowing Rule
      if (asm.id.startsWith("asm-catch-")) {
        const findingId = `fnd-catch-${asm.id}`;
        findings.push({
          id: findingId,
          title: "Silent Error Swallowing & Bug Masking",
          description: "Empty catch blocks hide runtime failures from error tracking tools (Sentry, Datadog) and developers.",
          severity: "HIGH",
          ruleId: "SILENT_ERROR_SWALLOWING_RULE",
          assumptionId: asm.id,
          evidenceIds: matchingEv ? [matchingEv.id] : [],
          line,
          snippet
        });

        risks.push({
          id: `risk-catch-${asm.id}`,
          level: "high",
          summary: "Undetected Production Outages: Critical background jobs fail silently without alerting on-call engineers.",
          findingId,
          potentialImpact: "System failures corrupt business state without triggering telemetry or error alerts."
        });
      }

      // 9. Network Timeout Boundary Rule
      if (asm.id.startsWith("asm-timeout-")) {
        const findingId = `fnd-timeout-${asm.id}`;
        findings.push({
          id: findingId,
          title: "Missing HTTP Client Request Timeout",
          description: "Executing network requests without timeout configuration risks hanging HTTP socket connections indefinitely.",
          severity: "HIGH",
          ruleId: "NETWORK_TIMEOUT_BOUNDARY_RULE",
          assumptionId: asm.id,
          evidenceIds: matchingEv ? [matchingEv.id] : [],
          line,
          snippet
        });

        risks.push({
          id: `risk-timeout-${asm.id}`,
          level: "high",
          summary: "Cascading Service Failure: Unbounded HTTP requests consume server socket pools during upstream outages.",
          findingId,
          potentialImpact: "Slow downstream services cause cascading failures across the entire microservices architecture."
        });
      }

      // 10. Unsafe Type Assertion Rule
      if (asm.id.startsWith("asm-type-")) {
        const findingId = `fnd-type-${asm.id}`;
        findings.push({
          id: findingId,
          title: "Unsafe Type Assertion ('as any') Type Bypass",
          description: "Using 'as any' bypasses TypeScript static type guarantees and conceals missing property crashes.",
          severity: "MEDIUM",
          ruleId: "UNSAFE_TYPE_ASSERTION_RULE",
          assumptionId: asm.id,
          evidenceIds: matchingEv ? [matchingEv.id] : [],
          line,
          snippet
        });

        risks.push({
          id: `risk-type-${asm.id}`,
          level: "medium",
          summary: "Runtime Type Drift Crash: API schema changes break code at runtime despite passing TypeScript build.",
          findingId,
          potentialImpact: "Production deployments crash when backend API payloads modify field names unexpectedly."
        });
      }

      // 11. SQL Injection Prevention Rule
      if (asm.id.startsWith("asm-sql-")) {
        const findingId = `fnd-sql-${asm.id}`;
        findings.push({
          id: findingId,
          title: "Dynamic SQL String Concatenation Vulnerability",
          description: "Concatenating user input directly into SQL strings allows attacker-controlled query execution.",
          severity: "CRITICAL",
          ruleId: "SQL_INJECTION_PREVENTION_RULE",
          assumptionId: asm.id,
          evidenceIds: matchingEv ? [matchingEv.id] : [],
          line,
          snippet
        });

        risks.push({
          id: `risk-sql-${asm.id}`,
          level: "critical",
          summary: "Database Exfiltration & Data Destruction: Attackers execute arbitrary SQL queries to dump or delete database tables.",
          findingId,
          potentialImpact: "Complete data breach or unauthorized database modification/deletion."
        });
      }

      // 12. Memory Leak Event Listener Rule
      if (asm.id.startsWith("asm-listener-")) {
        const findingId = `fnd-listener-${asm.id}`;
        findings.push({
          id: findingId,
          title: "Unbound Event Listener Memory Leak",
          description: "Registering global event listeners without cleanup handlers leaks heap memory on every component mount.",
          severity: "HIGH",
          ruleId: "MEMORY_LEAK_EVENT_LISTENER_RULE",
          assumptionId: asm.id,
          evidenceIds: matchingEv ? [matchingEv.id] : [],
          line,
          snippet
        });

        risks.push({
          id: `risk-listener-${asm.id}`,
          level: "high",
          summary: "Browser Tab Degradation & Out of Memory (OOM): Long-running single page app crashes client browser tabs.",
          findingId,
          potentialImpact: "Memory accumulation causes client browser tabs to slow down and crash after extended usage."
        });
      }

      // 13. Unhandled Async Event Handler Rule
      if (asm.id.startsWith("asm-asynchandler-")) {
        const findingId = `fnd-asynchandler-${asm.id}`;
        findings.push({
          id: findingId,
          title: "Unhandled Async UI Event Handler Rejection",
          description: "Async button click handlers without error boundaries leave UI buttons permanently stuck in pending states.",
          severity: "HIGH",
          ruleId: "UNHANDLED_ASYNC_EVENT_HANDLER_RULE",
          assumptionId: asm.id,
          evidenceIds: matchingEv ? [matchingEv.id] : [],
          line,
          snippet
        });

        risks.push({
          id: `risk-asynchandler-${asm.id}`,
          level: "high",
          summary: "Stuck Form Submissions: Failed API calls in click handlers leave buttons disabled indefinitely.",
          findingId,
          potentialImpact: "Users are unable to retry failed form submissions without refreshing the browser."
        });
      }

      // 14. Floating Point Currency Precision Rule
      if (asm.id.startsWith("asm-currency-")) {
        const findingId = `fnd-currency-${asm.id}`;
        findings.push({
          id: findingId,
          title: "Floating Point Financial Precision Error",
          description: "Performing float math directly on currency leads to IEEE 754 precision artifacts (e.g. 0.1 + 0.2 = 0.30000000000000004).",
          severity: "HIGH",
          ruleId: "FLOATING_POINT_CURRENCY_PRECISION_RULE",
          assumptionId: asm.id,
          evidenceIds: matchingEv ? [matchingEv.id] : [],
          line,
          snippet
        });

        risks.push({
          id: `risk-currency-${asm.id}`,
          level: "high",
          summary: "Billing & Transaction Mismatch: Inaccurate transaction totals cause payment gateway charge rejections.",
          findingId,
          potentialImpact: "Payment processors reject checkout charges due to fractional cent mismatch."
        });
      }

      // 15. API Rate Limiting Rule
      if (asm.id.startsWith("asm-ratelimit-")) {
        const findingId = `fnd-ratelimit-${asm.id}`;
        findings.push({
          id: findingId,
          title: "Public API Endpoint Rate Limit Missing",
          description: "Exposing API routes without rate limiting middleware permits automated scraping and brute force attacks.",
          severity: "MEDIUM",
          ruleId: "API_RATE_LIMITING_RULE",
          assumptionId: asm.id,
          evidenceIds: matchingEv ? [matchingEv.id] : [],
          line,
          snippet
        });

        risks.push({
          id: `risk-ratelimit-${asm.id}`,
          level: "medium",
          summary: "Denial of Service (DoS) & Resource Exhaustion: Botnets overwhelm server resources by spamming unthrottled API endpoints.",
          findingId,
          potentialImpact: "Automated scripts exhaust server CPU, memory, and database connections."
        });
      }
    });

    return { findings, risks };
  }
}
