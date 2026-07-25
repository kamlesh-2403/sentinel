import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { ReasoningEngine } from "../packages/engines/src/reasoningEngine";

async function runE2ETests() {
  console.log("===============================================================================");
  console.log("         SENTINEL READINESS ENGINE — END-TO-END E2E TEST SUITE                 ");
  console.log("===============================================================================\n");

  const engine = new ReasoningEngine();

  // Test 1: Vulnerable React Component (UserProfile.tsx)
  console.log("▶ [TEST 1] Scanning Vulnerable React Component (UserProfile.tsx)...");
  const vulnerablePath = "examples/sample-app/UserProfile.tsx";
  const vulnerableCode = fs.readFileSync(path.resolve(process.cwd(), vulnerablePath), "utf-8");
  const vulnerableReport = engine.analyze({
    filePath: vulnerablePath,
    sourceCode: vulnerableCode
  });

  console.log(`  Report ID       : ${vulnerableReport.id}`);
  console.log(`  Readiness Score : ${vulnerableReport.summary?.score} / 100`);
  console.log(`  Findings Count  : ${vulnerableReport.summary?.totalFindings}`);

  assert.strictEqual(vulnerableReport.summary?.score, 20, "Vulnerable component score should be 20/100");
  assert.strictEqual(vulnerableReport.summary?.totalFindings, 3, "Vulnerable component should have 3 findings");
  console.log("  ✅ TEST 1 PASSED: Correctly identified 3 critical assumption vulnerabilities.\n");

  // Test 2: Resilient React Component (CleanComponent.tsx)
  console.log("▶ [TEST 2] Scanning Resilient React Component (CleanComponent.tsx)...");
  const cleanPath = "examples/sample-app/CleanComponent.tsx";
  const cleanCode = fs.readFileSync(path.resolve(process.cwd(), cleanPath), "utf-8");
  const cleanReport = engine.analyze({
    filePath: cleanPath,
    sourceCode: cleanCode
  });

  console.log(`  Report ID       : ${cleanReport.id}`);
  console.log(`  Readiness Score : ${cleanReport.summary?.score} / 100`);
  console.log(`  Findings Count  : ${cleanReport.summary?.totalFindings}`);

  assert.strictEqual(cleanReport.summary?.score, 100, "Clean component score should be 100/100");
  assert.strictEqual(cleanReport.summary?.totalFindings, 0, "Clean component should have 0 findings");
  console.log("  ✅ TEST 2 PASSED: Verified 100% production readiness for resilient component.\n");

  console.log("===============================================================================");
  console.log(" 🎉 ALL E2E VERIFICATION TESTS PASSED SUCCESSFULLY!                             ");
  console.log("===============================================================================");
}

runE2ETests().catch((err) => {
  console.error("❌ E2E Test Suite Failed:", err);
  process.exit(1);
});
