import { getBody } from "./structure.js";

interface Issue {
  severity: "error" | "warning";
  line?: number;
  message: string;
}

export function validateContent(content: string): Issue[] {
  const issues: Issue[] = [];
  const body = getBody(content);
  const lines = body.split("\n");

  // Check for minimum content length
  if (body.trim().length < 200) {
    issues.push({
      severity: "warning",
      message: "Body is very short (< 200 chars). Add more detailed instructions.",
    });
  }

  // Check for "When to Use" or activation section
  const hasWhenSection = /## (When to|When to Use|Activation|Trigger)/i.test(body);
  if (!hasWhenSection) {
    issues.push({
      severity: "warning",
      message: "Consider adding a '## When to Activate' section",
    });
  }

  // Check for code examples
  const codeBlocks = body.match(/```[\s\S]*?```/g) || [];
  if (codeBlocks.length === 0) {
    issues.push({
      severity: "warning",
      message: "No code examples found. Add code blocks for clarity.",
    });
  }

  // Check for anti-patterns (❌)
  if (!body.includes("❌")) {
    issues.push({
      severity: "warning",
      message: "No anti-pattern examples (❌). Add negative examples for contrast.",
    });
  }

  // Check for good patterns (✅)
  if (!body.includes("✅")) {
    issues.push({
      severity: "warning",
      message: "No positive examples (✅). Add good practice examples.",
    });
  }

  // Check for second person (should use imperative)
  const secondPersonPatterns = /\byou should\b|\byou need to\b|\byou must\b|\byou can\b/gi;
  const matches = body.match(secondPersonPatterns);
  if (matches && matches.length > 3) {
    issues.push({
      severity: "warning",
      message: `Uses second person ${matches.length} times. Prefer imperative form (verb-first).`,
    });
  }

  // Check line count
  if (lines.length > 500) {
    issues.push({
      severity: "warning",
      message: `Body is ${lines.length} lines. Consider moving details to references/ folder (target: 100-200 lines).`,
    });
  }

  return issues;
}
