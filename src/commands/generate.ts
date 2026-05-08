import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

interface GenerateOptions {
  name?: string;
  output: string;
  triggers?: string[];
}

export function generate(description: string, options: GenerateOptions) {
  const name = options.name ?? slugify(description);
  const triggers = options.triggers ?? extractTriggers(description);

  const skillDir = join(options.output, name);
  if (existsSync(skillDir)) {
    console.error(`Error: Directory "${skillDir}" already exists.`);
    process.exit(1);
  }

  mkdirSync(skillDir, { recursive: true });

  const skillMd = buildSkillMd(name, description, triggers);
  writeFileSync(join(skillDir, "SKILL.md"), skillMd);

  console.log(`\n✓ Generated skill: ${name}`);
  console.log(`  📁 ${skillDir}/SKILL.md`);
  console.log(`  🎯 ${triggers.length} trigger phrases`);
  console.log(`\nNext steps:`);
  console.log(`  1. Edit ${skillDir}/SKILL.md to add your instructions`);
  console.log(`  2. Run: skill-forge validate ${skillDir}/SKILL.md`);
  console.log(`  3. Run: skill-forge score ${skillDir}/SKILL.md`);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

function extractTriggers(description: string): string[] {
  const words = description.toLowerCase().split(/\s+/);
  const triggers: string[] = [];

  // Generate trigger phrases from description
  triggers.push(description);

  // Extract key phrases
  const keyPatterns = [
    description.slice(0, 40),
    `help me ${description.toLowerCase()}`,
    `how to ${description.toLowerCase()}`,
  ];
  triggers.push(...keyPatterns);

  // Add common patterns
  if (words.length > 2) {
    triggers.push(words.slice(0, 3).join(" "));
  }

  return [...new Set(triggers)].slice(0, 5);
}

function buildSkillMd(name: string, description: string, triggers: string[]): string {
  const triggerStr = triggers.map((t) => `"${t}"`).join(",\n  ");

  return `---
name: ${name}
description: This skill should be used when ${triggerStr}.
version: 1.0.0
---

# ${toTitle(name)}

${description}

## When to Activate

- [List specific scenarios when this skill should trigger]

## Core Rules

### Rule 1: [Rule Name]

[Describe the rule in imperative form]

\`\`\`
❌ BAD: [Example of what NOT to do]
✅ GOOD: [Example of what TO do]
\`\`\`

### Rule 2: [Rule Name]

[Describe the rule]

## Decision Tree

\`\`\`
1. [First decision point]
   YES → [Action]
   NO  → [Next check]

2. [Second decision point]
   YES → [Action]
   NO  → [Default action]
\`\`\`

## Anti-Patterns

- ❌ NEVER: [Anti-pattern 1]
- ❌ NEVER: [Anti-pattern 2]
- ❌ NEVER: [Anti-pattern 3]

## Example Output

\`\`\`typescript
// Example of expected output or behavior
\`\`\`
`;
}

function toTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
