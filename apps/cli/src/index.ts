#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { ReasoningEngine } from "../../../packages/engines/src/reasoningEngine";

function collectFiles(dirPath: string): string[] {
  let files: string[] = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name === "node_modules" ||
        entry.name === ".git" ||
        entry.name === "dist" ||
        entry.name === "build" ||
        entry.name === ".next"
      ) {
        continue;
      }
      files = files.concat(collectFiles(fullPath));
    } else if (entry.isFile()) {
      if (/\.(tsx?|jsx?)$/i.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

export function runCli(args: string[]) {
  console.log("===============================================================================");
  console.log("               SENTINEL — PRODUCTION READINESS INTELLIGENCE                    ");
  console.log("===============================================================================");
  
  const targetInput = args[0] || "examples/sample-app";
  let absolutePath = path.resolve(process.cwd(), targetInput);
  if (!fs.existsSync(absolutePath)) {
    const rootFallback = path.resolve(process.cwd(), "../..", targetInput);
    if (fs.existsSync(rootFallback)) {
      absolutePath = rootFallback;
    } else {
      console.error(`Error: File or directory not found at path: ${absolutePath}`);
      process.exit(1);
    }
  }

  const stat = fs.statSync(absolutePath);
  const targetFiles: string[] = stat.isDirectory()
    ? collectFiles(absolutePath)
    : [absolutePath];

  if (targetFiles.length === 0) {
    console.log(`No TypeScript/JavaScript files found in target: ${targetInput}`);
    return;
  }

  console.log(`Scanning Target: ${targetInput} (${targetFiles.length} file(s) found)`);
  console.log("Executing Reasoning Engine Pipeline...\n");

  const engine = new ReasoningEngine();
  let totalScore = 0;
  let totalFindingsCount = 0;
  let totalAssumptionsCount = 0;
  let totalRulesEvaluated = 0;

  targetFiles.forEach((file, fileIdx) => {
    const sourceCode = fs.readFileSync(file, "utf-8");
    const relativePath = path.relative(process.cwd(), file);
    const report = engine.analyze({
      filePath: relativePath,
      sourceCode
    });

    totalScore += report.summary?.score ?? 100;
    totalFindingsCount += report.summary?.totalFindings ?? 0;
    totalAssumptionsCount += report.statistics?.totalAssumptionsIdentified ?? 0;
    totalRulesEvaluated += report.statistics?.totalRulesEvaluated ?? 0;

    console.log(`-------------------------------------------------------------------------------`);
    console.log(`[FILE ${fileIdx + 1}/${targetFiles.length}] ${relativePath}`);
    console.log(`READINESS SCORE: [ ${report.summary?.score} / 100 ]`);

    if (report.findings && report.findings.length > 0) {
      console.log("FINDINGS & AFFECTED CODE LINES:");
      report.findings.forEach((fnd, idx) => {
        console.log(`  ${idx + 1}. [${fnd.severity}] ${fnd.title}`);
        console.log(`     Description  : ${fnd.description}`);
        console.log(`     Rule ID      : ${fnd.ruleId}`);
        if (fnd.line) {
          console.log(`     Line Number  : Line ${fnd.line}`);
        }
        if (fnd.snippet) {
          console.log(`     Code Snippet : ${fnd.snippet}`);
        }
        console.log();
      });
    } else {
      console.log("  ✅ No production risks found in this file.");
    }
    console.log();
  });

  const avgScore = Math.round(totalScore / targetFiles.length);

  console.log("===============================================================================");
  console.log("                       FINAL APPLICATION SUMMARY                               ");
  console.log("===============================================================================");
  console.log(`Target Path               : ${targetInput}`);
  console.log(`Files Analyzed            : ${targetFiles.length}`);
  console.log(`Overall Readiness Score   : [ ${avgScore} / 100 ] — ${avgScore < 50 ? "DANGEROUSLY LOW READINESS" : "READINESS OK"}`);
  console.log(`Total Production Risks    : ${totalFindingsCount}`);
  console.log(`Total Assumptions Tracked : ${totalAssumptionsCount}`);
  console.log(`Total Rules Evaluated     : ${totalRulesEvaluated}`);
  console.log("===============================================================================");
}

if (process.argv[1]?.includes("cli") || process.argv[1]?.includes("index") || process.argv[1]?.includes("sentinel")) {
  runCli(process.argv.slice(2));
}
