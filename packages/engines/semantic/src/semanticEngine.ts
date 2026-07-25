import type { Evidence, Observation } from "@sentinel/domain";

export class SemanticEngine {
  public analyze(filePath: string, evidences: Evidence[]): Observation[] {
    const observations: Observation[] = [];

    evidences.forEach((ev) => {
      if (ev.id.startsWith("ev-hook-dep-")) {
        observations.push({
          id: `obs-stale-closure-${ev.line}`,
          title: `Stale Closure & Omitted Hook Dependency`,
          description: `The hook at line ${ev.line} reads variable in closure but omits it from dependency array. Component will not re-evaluate when this variable changes.`,
          evidenceIds: [ev.id]
        });
      }

      if (ev.id.startsWith("ev-fetch-no-catch-")) {
        observations.push({
          id: `obs-unhandled-network-${ev.line}`,
          title: `Unbounded Network Call Lacks Failure Recovery`,
          description: `Asynchronous fetch network request at line ${ev.line} lacks error handling boundary (try/catch or .catch). HTTP 5xx or connection timeout will cause unhandled promise rejection.`,
          evidenceIds: [ev.id]
        });
      }

      if (ev.id.startsWith("ev-unsafe-access-")) {
        observations.push({
          id: `obs-unguarded-null-${ev.line}`,
          title: `Unguarded Property Access on Potential Null Object`,
          description: `Property access '${ev.snippet}' at line ${ev.line} dereferences object without null guard or optional chaining. Access before async resolution will throw runtime TypeError.`,
          evidenceIds: [ev.id]
        });
      }

      if (ev.id.startsWith("ev-sync-io-")) {
        observations.push({
          id: `obs-sync-io-${ev.line}`,
          title: `Synchronous I/O Execution in Server Request Cycle`,
          description: `Synchronous call '${ev.snippet}' at line ${ev.line} blocks Node.js single-threaded event loop, preventing execution of concurrent client requests.`,
          evidenceIds: [ev.id]
        });
      }

      if (ev.id.startsWith("ev-hardcoded-secret-")) {
        observations.push({
          id: `obs-hardcoded-secret-${ev.line}`,
          title: `Hardcoded API Secret or Credential Leak`,
          description: `Hardcoded credential '${ev.snippet}' at line ${ev.line} commits sensitive security tokens into public or shared version control history.`,
          evidenceIds: [ev.id]
        });
      }

      if (ev.id.startsWith("ev-index-as-key-")) {
        observations.push({
          id: `obs-index-as-key-${ev.line}`,
          title: `Array Index Used as React Component List Key`,
          description: `React list item at line ${ev.line} uses array index as key prop. Reordering or deleting list items causes state corruption and DOM mismatch.`,
          evidenceIds: [ev.id]
        });
      }

      if (ev.id.startsWith("ev-state-mutation-")) {
        observations.push({
          id: `obs-state-mutation-${ev.line}`,
          title: `Direct In-Place Mutation of React State Variable`,
          description: `In-place mutation '${ev.snippet}' at line ${ev.line} mutates state object directly, bypassing React object reference equality checks and failing to trigger re-renders.`,
          evidenceIds: [ev.id]
        });
      }

      if (ev.id.startsWith("ev-silent-catch-")) {
        observations.push({
          id: `obs-silent-catch-${ev.line}`,
          title: `Silent Error Swallowing in Catch Block`,
          description: `Catch block at line ${ev.line} swallows thrown exception without logging, metric reporting, or error recovery, masking critical runtime bugs.`,
          evidenceIds: [ev.id]
        });
      }

      if (ev.id.startsWith("ev-no-timeout-")) {
        observations.push({
          id: `obs-no-timeout-${ev.line}`,
          title: `HTTP Client Call Lacks Request Timeout Boundary`,
          description: `Network client request at line ${ev.line} executes without timeout setting. Slow or hung upstream backend will exhaust server connection pools.`,
          evidenceIds: [ev.id]
        });
      }

      if (ev.id.startsWith("ev-unsafe-type-assertion-")) {
        observations.push({
          id: `obs-unsafe-type-assertion-${ev.line}`,
          title: `Unsafe Type Assertion ('as any') Disables Compiler Checking`,
          description: `Unsafe type assertion at line ${ev.line} disables TypeScript type checking, allowing invalid object schemas to bypass compile-time verification.`,
          evidenceIds: [ev.id]
        });
      }

      if (ev.id.startsWith("ev-sql-injection-")) {
        observations.push({
          id: `obs-sql-injection-${ev.line}`,
          title: `Dynamic SQL String Concatenation Vulnerability`,
          description: `Dynamic query concatenation at line ${ev.line} constructs raw SQL string with untrusted user input, exposing database to SQL Injection attacks.`,
          evidenceIds: [ev.id]
        });
      }

      if (ev.id.startsWith("ev-event-listener-leak-")) {
        observations.push({
          id: `obs-event-listener-leak-${ev.line}`,
          title: `Unbound Event Listener Attached Without Teardown Cleanup`,
          description: `Event listener at line ${ev.line} registered without matching removeEventListener/teardown handler, causing progressive memory leak on component re-mounts.`,
          evidenceIds: [ev.id]
        });
      }

      if (ev.id.startsWith("ev-unhandled-async-handler-")) {
        observations.push({
          id: `obs-unhandled-async-handler-${ev.line}`,
          title: `Async UI Event Handler Lacks Error Catching`,
          description: `Async event handler at line ${ev.line} executes asynchronous logic without try/catch or error handling, causing unhandled promise rejections on user click.`,
          evidenceIds: [ev.id]
        });
      }

      if (ev.id.startsWith("ev-floating-point-currency-")) {
        observations.push({
          id: `obs-floating-point-currency-${ev.line}`,
          title: `Floating Point Arithmetic on Financial Currency Values`,
          description: `Floating point math at line ${ev.line} computes financial calculations directly using IEEE 754 float, resulting in fractional rounding errors.`,
          evidenceIds: [ev.id]
        });
      }

      if (ev.id.startsWith("ev-missing-rate-limit-")) {
        observations.push({
          id: `obs-missing-rate-limit-${ev.line}`,
          title: `Public API Endpoint Lacks Rate Limiting Guard`,
          description: `Express API route at line ${ev.line} exposed without rate limiting middleware, leaving service vulnerable to automated brute force and DoS attacks.`,
          evidenceIds: [ev.id]
        });
      }
    });

    return observations;
  }
}
