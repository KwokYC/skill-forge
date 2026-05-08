import { getBody } from "../validators/structure.js";

interface FrontmatterObj {
  name?: string;
  description?: string;
  version?: string;
  [key: string]: unknown;
}

// Structure score: 0-20
export function scoreStructure(content: string, fm: FrontmatterObj | null): number {
  let score = 0;

  // Has frontmatter (5)
  if (fm) score += 5;

  // Has name (5)
  if (fm?.name) score += 5;

  // Has description (5)
  if (fm?.description) score += 5;

  // Has version (3)
  if (fm?.version) score += 3;

  // Has title heading (2)
  const body = getBody(content);
  if (/^# .+/m.test(body)) score += 2;

  return Math.min(score, 20);
}

// Trigger score: 0-25
export function scoreTriggers(description: string): number {
  let score = 0;

  if (!description) return 0;

  // Has quoted phrases (up to 15)
  const quoted = description.match(/"([^"]+)"/g) || [];
  score += Math.min(quoted.length * 3, 15);

  // Trigger specificity: average phrase length
  if (quoted.length > 0) {
    const avgLen = quoted.reduce((sum, q) => sum + q.length, 0) / quoted.length;
    if (avgLen > 10) score += 5;
    else if (avgLen > 5) score += 3;
  }

  // Has trigger preamble ("This skill should be used when")
  if (/This skill should be used when/i.test(description)) {
    score += 5;
  }

  return Math.min(score, 25);
}

// Content score: 0-25
export function scoreContent(content: string): number {
  let score = 0;
  const body = getBody(content);

  // Has code blocks (up to 8)
  const codeBlocks = body.match(/```[\s\S]*?```/g) || [];
  score += Math.min(codeBlocks.length * 2, 8);

  // Has anti-patterns (❌) (up to 5)
  const antiPatterns = (body.match(/❌/g) || []).length;
  score += Math.min(antiPatterns, 5);

  // Has good patterns (✅) (up to 5)
  const goodPatterns = (body.match(/✅/g) || []).length;
  score += Math.min(goodPatterns, 5);

  // Has decision tree or process steps (2)
  if (/## (Decision|Process|Steps|Workflow|When to)/i.test(body)) {
    score += 2;
  }

  // Has anti-patterns section (2)
  if (/## (Anti-Pattern|NEVER|Don't|Avoid|Pitfalls)/i.test(body)) {
    score += 2;
  }

  // Has structured sections (3+ headings)
  const headings = body.match(/^##\s/gm) || [];
  if (headings.length >= 3) score += 3;

  return Math.min(score, 25);
}

// Token efficiency: 0-15
export function scoreTokenEfficiency(content: string): number {
  let score = 0;
  const body = getBody(content);
  const wordCount = body.split(/\s+/).length;

  // Optimal length: 1000-3000 words (10 points)
  if (wordCount >= 1000 && wordCount <= 3000) {
    score += 10;
  } else if (wordCount >= 500 && wordCount <= 4000) {
    score += 7;
  } else if (wordCount >= 200) {
    score += 4;
  } else {
    score += 1;
  }

  // Concise: not excessively verbose (5 points)
  const lines = body.split("\n");
  const longLines = lines.filter((l) => l.length > 120).length;
  const longRatio = longLines / Math.max(lines.length, 1);
  if (longRatio < 0.1) score += 5;
  else if (longRatio < 0.2) score += 3;
  else score += 1;

  return Math.min(score, 15);
}

// Actionability: 0-15
export function scoreActionability(content: string): number {
  let score = 0;
  const body = getBody(content);

  // Structured with multiple sections (up to 5)
  const headings = body.match(/^##\s.+/gm) || [];
  score += Math.min(headings.length, 5);

  // Has checklists (2)
  if (/\- \[.\]/.test(body)) score += 2;

  // Has command examples (bash/code) (3)
  if (/```(bash|sh|shell)[\s\S]*?```/.test(body)) score += 3;

  // Has specific actionable examples with code (3)
  const codeBlocks = body.match(/```[\s\S]*?```/g) || [];
  if (codeBlocks.length >= 3) score += 3;

  // Has table for reference (2)
  if (/\|.+\|.+\|/.test(body)) score += 2;

  return Math.min(score, 15);
}
