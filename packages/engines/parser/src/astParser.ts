import type { Evidence } from "@sentinel/domain";

export interface ParsedAstResult {
  filePath: string;
  sourceCode: string;
  evidences: Evidence[];
  identifiersInScope: string[];
}

export class AstParserEngine {
  public parse(filePath: string, sourceCode: string): ParsedAstResult {
    const evidences: Evidence[] = [];
    const lines = sourceCode.split("\n");

    let foundHookDep = false;
    let foundNetworkNoCatch = false;
    let foundUnsafeAccess = false;
    let foundSyncIo = false;
    let foundHardcodedSecret = false;
    let foundIndexAsKey = false;
    let foundStateMutation = false;
    let foundSilentCatch = false;
    let foundNoTimeout = false;
    let foundUnsafeTypeAssertion = false;
    let foundSqlInjection = false;
    let foundEventListenerLeak = false;
    let foundUnhandledAsyncHandler = false;
    let foundFloatingPointCurrency = false;
    let foundMissingRateLimit = false;

    lines.forEach((lineText, lineIdx) => {
      const lineNum = lineIdx + 1;
      const trimmed = lineText.trim();

      // 1. Hook Dependency Analysis (Stale Closure)
      if (lineText.includes("useEffect") && !foundHookDep) {
        const isEmptyDepArray = sourceCode.includes("}, []");
        const matchProp = sourceCode.match(/fetch\([`'].*?\$\{([a-zA-Z0-9_$]+)\}/);

        if (matchProp && isEmptyDepArray) {
          const varName = matchProp[1];
          if (!sourceCode.includes(`[${varName}]`)) {
            foundHookDep = true;
            evidences.push({
              id: `ev-hook-dep-${varName}-${lineNum}`,
              fileId: filePath,
              snippet: `Hook closure variable '${varName}' missing from dependency array`,
              line: lineNum,
              column: 1,
              explanation: `Variable '${varName}' is referenced inside useEffect callback but absent from dependency array`
            });
          }
        }
      }

      // 2. Fetch/Axios network call without error handling
      if ((lineText.includes("fetch(") || lineText.includes("axios.")) && !foundNetworkNoCatch) {
        const hasCatchInCode = sourceCode.includes(".catch") || sourceCode.includes("try {");
        if (!hasCatchInCode) {
          foundNetworkNoCatch = true;
          evidences.push({
            id: `ev-fetch-no-catch-${lineNum}`,
            fileId: filePath,
            snippet: trimmed,
            line: lineNum,
            column: lineText.indexOf("fetch") + 1,
            explanation: "Asynchronous network request lacks error boundary (.catch or try/catch)"
          });
        }
      }

      // 3. Unguarded property access on unverified state variable
      if ((lineText.includes(".name") || lineText.includes(".email") || lineText.includes(".id")) && !foundUnsafeAccess) {
        const hasNullGuard = sourceCode.includes("if (!user)") || sourceCode.includes("user?.") || sourceCode.includes("user &&");
        if (!hasNullGuard && lineText.includes("user.")) {
          foundUnsafeAccess = true;
          evidences.push({
            id: `ev-unsafe-access-${lineNum}`,
            fileId: filePath,
            snippet: trimmed,
            line: lineNum,
            column: lineText.indexOf("user.") + 1,
            explanation: "Direct property access on unverified state variable 'user' without null guard or optional chaining"
          });
        }
      }

      // 4. Synchronous I/O in server or component code (Blocking Event Loop)
      if ((lineText.includes("fs.readFileSync") || lineText.includes("fs.writeFileSync") || lineText.includes("execSync")) && !foundSyncIo) {
        foundSyncIo = true;
        evidences.push({
          id: `ev-sync-io-${lineNum}`,
          fileId: filePath,
          snippet: trimmed,
          line: lineNum,
          column: 1,
          explanation: "Synchronous file system / child process operation blocks Node.js single-threaded event loop"
        });
      }

      // 5. Hardcoded Secret / Credential Leak
      if (
        (lineText.match(/api[_-]?key\s*=\s*['"][a-zA-Z0-9_-]{8,}['"]/i) ||
          lineText.match(/secret\s*=\s*['"][a-zA-Z0-9_-]{8,}['"]/i) ||
          lineText.match(/password\s*=\s*['"][^'"]+['"]/i) ||
          lineText.includes("bearer eyJ")) &&
        !foundHardcodedSecret
      ) {
        foundHardcodedSecret = true;
        evidences.push({
          id: `ev-hardcoded-secret-${lineNum}`,
          fileId: filePath,
          snippet: trimmed,
          line: lineNum,
          column: 1,
          explanation: "Hardcoded API key, token, or password credential detected in source code"
        });
      }

      // 6. Index as React List Key Prop
      if (lineText.match(/key=\{(index|idx)\}/) && !foundIndexAsKey) {
        foundIndexAsKey = true;
        evidences.push({
          id: `ev-index-as-key-${lineNum}`,
          fileId: filePath,
          snippet: trimmed,
          line: lineNum,
          column: lineText.indexOf("key=") + 1,
          explanation: "Using array index as React list item key prop causes state corruption and unnecessary re-renders on list mutation"
        });
      }

      // 7. Direct State Mutation
      if ((lineText.match(/set[A-Z][a-zA-Z0-9]*\([^)]*\.push\(/) || lineText.match(/state\.[a-zA-Z0-9_-]+\s*=/)) && !foundStateMutation) {
        foundStateMutation = true;
        evidences.push({
          id: `ev-state-mutation-${lineNum}`,
          fileId: filePath,
          snippet: trimmed,
          line: lineNum,
          column: 1,
          explanation: "Direct in-place state mutation bypasses React reconciliation and prevents view updates"
        });
      }

      // 8. Silent Catch Block / Error Swallowing
      if ((lineText.includes("catch (") || lineText.includes("catch(")) && !foundSilentCatch) {
        const nextLines = lines.slice(lineIdx, lineIdx + 4).join(" ");
        if (nextLines.includes("catch") && (nextLines.match(/catch\s*\([^)]*\)\s*\{\s*\}/) || nextLines.match(/catch\s*\([^)]*\)\s*\{\s*return null;?\s*\}/))) {
          foundSilentCatch = true;
          evidences.push({
            id: `ev-silent-catch-${lineNum}`,
            fileId: filePath,
            snippet: trimmed,
            line: lineNum,
            column: 1,
            explanation: "Silent catch block swallows runtime errors without logging, reporting, or failure recovery"
          });
        }
      }

      // 9. Missing Network Timeout Boundary
      if ((lineText.includes("axios.get") || lineText.includes("axios.post") || lineText.includes("fetch(")) && !foundNoTimeout) {
        if (!sourceCode.includes("timeout") && !sourceCode.includes("signal:")) {
          foundNoTimeout = true;
          evidences.push({
            id: `ev-no-timeout-${lineNum}`,
            fileId: filePath,
            snippet: trimmed,
            line: lineNum,
            column: 1,
            explanation: "Asynchronous HTTP client call lacks explicit timeout configuration or AbortSignal deadline"
          });
        }
      }

      // 10. Unsafe Type Assertion (`as any` / `as unknown as`)
      if ((lineText.includes("as any") || lineText.includes("as unknown as")) && !foundUnsafeTypeAssertion) {
        foundUnsafeTypeAssertion = true;
        evidences.push({
          id: `ev-unsafe-type-assertion-${lineNum}`,
          fileId: filePath,
          snippet: trimmed,
          line: lineNum,
          column: lineText.indexOf("as any") + 1,
          explanation: "Unsafe type assertion ('as any') bypasses TypeScript static type checking and compiler safety"
        });
      }

      // 11. Unsanitized SQL Query Concatenation (SQL Injection)
      if (
        (lineText.match(/SELECT\s+.*\s+FROM/i) || lineText.match(/INSERT\s+INTO/i) || lineText.match(/UPDATE\s+.*\s+SET/i)) &&
        (lineText.includes("+") || lineText.includes("${")) &&
        !foundSqlInjection
      ) {
        foundSqlInjection = true;
        evidences.push({
          id: `ev-sql-injection-${lineNum}`,
          fileId: filePath,
          snippet: trimmed,
          line: lineNum,
          column: 1,
          explanation: "Dynamic string concatenation in SQL query string exposes database to SQL Injection vulnerability"
        });
      }

      // 12. Unhandled Event Listener (Memory Leak)
      if ((lineText.includes("addEventListener") || lineText.includes(".on('")) && !foundEventListenerLeak) {
        const hasRemoveListener = sourceCode.includes("removeEventListener") || sourceCode.includes(".off(") || sourceCode.includes("removeListener");
        if (!hasRemoveListener) {
          foundEventListenerLeak = true;
          evidences.push({
            id: `ev-event-listener-leak-${lineNum}`,
            fileId: filePath,
            snippet: trimmed,
            line: lineNum,
            column: 1,
            explanation: "Event listener attached without corresponding cleanup / teardown handler introduces memory leak"
          });
        }
      }

      // 13. Unhandled Async Event Handler
      if (
        (lineText.match(/onClick\s*=\s*\{\s*async/) || lineText.match(/onSubmit\s*=\s*\{\s*async/)) &&
        !foundUnhandledAsyncHandler
      ) {
        if (!sourceCode.includes("try {") && !sourceCode.includes(".catch")) {
          foundUnhandledAsyncHandler = true;
          evidences.push({
            id: `ev-unhandled-async-handler-${lineNum}`,
            fileId: filePath,
            snippet: trimmed,
            line: lineNum,
            column: 1,
            explanation: "Async UI event handler lacks error handling, causing unhandled promise rejections on user interaction"
          });
        }
      }

      // 14. Floating Point Math on Currency / Financial Values
      if (
        (lineText.match(/(price|amount|total|cost|tax)\s*[*+-/]\s*0\.\d+/) || lineText.match(/0\.\d+\s*[*+-/]\s*(price|amount|total|cost|tax)/)) &&
        !lineText.includes("Math.round") &&
        !lineText.includes("toFixed") &&
        !foundFloatingPointCurrency
      ) {
        foundFloatingPointCurrency = true;
        evidences.push({
          id: `ev-floating-point-currency-${lineNum}`,
          fileId: filePath,
          snippet: trimmed,
          line: lineNum,
          column: 1,
          explanation: "Direct floating point arithmetic on financial values leads to IEEE 754 precision rounding errors"
        });
      }

      // 15. Missing Rate Limiting on Express Route
      if (
        (lineText.match(/app\.(get|post|put|delete|patch)\s*\(['"]/)) &&
        !sourceCode.includes("rateLimit") &&
        !foundMissingRateLimit
      ) {
        foundMissingRateLimit = true;
        evidences.push({
          id: `ev-missing-rate-limit-${lineNum}`,
          fileId: filePath,
          snippet: trimmed,
          line: lineNum,
          column: 1,
          explanation: "Public Express API route lacks rate limiting middleware, exposing server to Denial of Service (DoS) and brute force attacks"
        });
      }
    });

    return {
      filePath,
      sourceCode,
      evidences,
      identifiersInScope: []
    };
  }
}
