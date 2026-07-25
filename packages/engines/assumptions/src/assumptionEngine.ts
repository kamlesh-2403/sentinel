import type { Observation, Assumption } from "@sentinel/domain";

export class AssumptionEngine {
  public inferAssumptions(observations: Observation[]): Assumption[] {
    const assumptions: Assumption[] = [];

    observations.forEach((obs) => {
      if (obs.id.startsWith("obs-stale-closure-")) {
        assumptions.push({
          id: `asm-hook-${obs.id}`,
          statement: `Developer implicitly assumes closure variables referenced inside hook will never mutate or update during component lifecycle.`,
          confidence: 0.95,
          observationIds: [obs.id]
        });
      }

      if (obs.id.startsWith("obs-unhandled-network-")) {
        assumptions.push({
          id: `asm-net-${obs.id}`,
          statement: `Developer implicitly assumes remote network endpoint will always respond with 200 OK and zero network failure.`,
          confidence: 0.98,
          observationIds: [obs.id]
        });
      }

      if (obs.id.startsWith("obs-unguarded-null-")) {
        assumptions.push({
          id: `asm-null-${obs.id}`,
          statement: `Developer implicitly assumes state object is fully initialized before initial render execution.`,
          confidence: 0.99,
          observationIds: [obs.id]
        });
      }

      if (obs.id.startsWith("obs-sync-io-")) {
        assumptions.push({
          id: `asm-syncio-${obs.id}`,
          statement: `Developer implicitly assumes file I/O operations execute instantly without blocking concurrent server requests on single Node.js event loop thread.`,
          confidence: 0.95,
          observationIds: [obs.id]
        });
      }

      if (obs.id.startsWith("obs-hardcoded-secret-")) {
        assumptions.push({
          id: `asm-secret-${obs.id}`,
          statement: `Developer implicitly assumes hardcoded credentials in source code will never be exposed via public git history or client bundles.`,
          confidence: 0.99,
          observationIds: [obs.id]
        });
      }

      if (obs.id.startsWith("obs-index-as-key-")) {
        assumptions.push({
          id: `asm-key-${obs.id}`,
          statement: `Developer implicitly assumes dynamic list items will remain strictly static in ordering and will never be filtered, sorted, or deleted.`,
          confidence: 0.90,
          observationIds: [obs.id]
        });
      }

      if (obs.id.startsWith("obs-state-mutation-")) {
        assumptions.push({
          id: `asm-mutation-${obs.id}`,
          statement: `Developer implicitly assumes direct object property assignment will trigger React component re-renders.`,
          confidence: 0.92,
          observationIds: [obs.id]
        });
      }

      if (obs.id.startsWith("obs-silent-catch-")) {
        assumptions.push({
          id: `asm-catch-${obs.id}`,
          statement: `Developer implicitly assumes caught exceptions can be ignored safely without affecting downstream application state or user workflow.`,
          confidence: 0.94,
          observationIds: [obs.id]
        });
      }

      if (obs.id.startsWith("obs-no-timeout-")) {
        assumptions.push({
          id: `asm-timeout-${obs.id}`,
          statement: `Developer implicitly assumes network server endpoints will always complete response within acceptable time limits without hanging sockets.`,
          confidence: 0.96,
          observationIds: [obs.id]
        });
      }

      if (obs.id.startsWith("obs-unsafe-type-assertion-")) {
        assumptions.push({
          id: `asm-type-${obs.id}`,
          statement: `Developer implicitly assumes external JSON or API payloads match expected TypeScript types at runtime without validation.`,
          confidence: 0.93,
          observationIds: [obs.id]
        });
      }

      if (obs.id.startsWith("obs-sql-injection-")) {
        assumptions.push({
          id: `asm-sql-${obs.id}`,
          statement: `Developer implicitly assumes user input passed to SQL query is trusted and free from malicious SQL control characters.`,
          confidence: 0.99,
          observationIds: [obs.id]
        });
      }

      if (obs.id.startsWith("obs-event-listener-leak-")) {
        assumptions.push({
          id: `asm-listener-${obs.id}`,
          statement: `Developer implicitly assumes event listeners registered on window or DOM targets will automatically clean up when component unmounts.`,
          confidence: 0.91,
          observationIds: [obs.id]
        });
      }

      if (obs.id.startsWith("obs-unhandled-async-handler-")) {
        assumptions.push({
          id: `asm-asynchandler-${obs.id}`,
          statement: `Developer implicitly assumes user interaction async callbacks will never fail or reject.`,
          confidence: 0.93,
          observationIds: [obs.id]
        });
      }

      if (obs.id.startsWith("obs-floating-point-currency-")) {
        assumptions.push({
          id: `asm-currency-${obs.id}`,
          statement: `Developer implicitly assumes binary IEEE 754 floating point numbers represent exact base-10 decimal currency values.`,
          confidence: 0.97,
          observationIds: [obs.id]
        });
      }

      if (obs.id.startsWith("obs-missing-rate-limit-")) {
        assumptions.push({
          id: `asm-ratelimit-${obs.id}`,
          statement: `Developer implicitly assumes API endpoints will only be called by well-behaved human users operating normal browser clients.`,
          confidence: 0.96,
          observationIds: [obs.id]
        });
      }
    });

    return assumptions;
  }
}
