import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { parseFrontmatter } from "../validators/structure.js";
import { validateContent } from "../validators/content.js";
import { validateTriggers } from "../validators/triggers.js";

interface ValidateOptions {
  strict: boolean;
}

interface Issue {
  severity: "error" | "warning";
  line?: number;
  message: string;
}

export function validate(path: string, options: ValidateOptions) {
  const fullPath = resolve(path);

  let content: string;
  try {
    content = readFileSync(fullPath, "utf-8");
  } catch {
    console.error(`Error: Cannot read file "${fullPath}"`);
    process.exit(1);
  }

  const issues: Issue[] = [];

  // Parse frontmatter
  const fm = parseFrontmatter(content);
  if (!fm) {
    issues.push({ severity: "error", message: "Missing or invalid YAML frontmatter" });
  } else {
    if (!fm.name) issues.push({ severity: "error", message: "Missing required field: name" });
    if (!fm.description) issues.push({ severity: "error", message: "Missing required field: description" });
  }

  // Validate structure
  const bodyIssues = validateContent(content);
  issues.push(...bodyIssues);

  // Validate triggers
  if (fm?.description) {
    const triggerIssues = validateTriggers(fm.description);
    issues.push(...triggerIssues);
  }

  // Strict mode: warnings become errors
  if (options.strict) {
    issues.forEach((i) => {
      if (i.severity === "warning") i.severity = "error";
    });
  }

  // Output
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  console.log(`\nValidating: ${fullPath}\n`);

  for (const issue of issues) {
    const icon = issue.severity === "error" ? "✗" : "⚠";
    const label = issue.severity.toUpperCase();
    const loc = issue.line ? ` (line ${issue.line})` : "";
    console.log(`  ${icon} [${label}]${loc} ${issue.message}`);
  }

  console.log(`\n  Errors: ${errors.length} | Warnings: ${warnings.length}`);

  if (errors.length > 0) {
    console.log(`\n  ✗ INVALID\n`);
    process.exit(1);
  } else {
    console.log(`\n  ✓ VALID\n`);
  }
}
