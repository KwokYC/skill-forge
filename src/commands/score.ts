import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import { resolve, join, basename } from "node:path";
import { parseFrontmatter } from "../validators/structure.js";
import { scoreStructure, scoreTriggers, scoreContent, scoreTokenEfficiency, scoreActionability } from "../scorer/index.js";

interface ScoreOptions {
  format: "table" | "json" | "text";
  output?: string;
  min: string;
}

interface SkillScore {
  name: string;
  path: string;
  structure: number;
  triggers: number;
  content: number;
  tokenEfficiency: number;
  actionability: number;
  total: number;
  grade: string;
  suggestions: string[];
}

export function score(path: string, options: ScoreOptions) {
  const fullPath = resolve(path);
  const minScore = parseInt(options.min, 10);

  const skillFiles = findSkillFiles(fullPath);

  if (skillFiles.length === 0) {
    console.error(`No SKILL.md files found at "${fullPath}"`);
    process.exit(1);
  }

  const scores: SkillScore[] = skillFiles.map((file) => scoreFile(file));

  const output = formatOutput(scores, options.format);

  if (options.output) {
    writeFileSync(options.output, output);
    console.log(`Report written to ${options.output}`);
  } else {
    console.log(output);
  }

  // Check minimum score
  const failing = scores.filter((s) => s.total < minScore);
  if (failing.length > 0) {
    console.log(`\n${failing.length} skill(s) below minimum score of ${minScore}`);
    process.exit(1);
  }
}

function findSkillFiles(path: string): string[] {
  if (!existsSync(path)) return [];

  const stat = statSync(path);
  if (stat.isFile() && basename(path) === "SKILL.md") {
    return [path];
  }

  if (stat.isDirectory()) {
    const files: string[] = [];
    const entries = readdirSync(path, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(path, entry.name);
      if (entry.isFile() && entry.name === "SKILL.md") {
        files.push(fullPath);
      } else if (entry.isDirectory()) {
        files.push(...findSkillFiles(fullPath));
      }
    }
    return files;
  }

  return [];
}

function scoreFile(filePath: string): SkillScore {
  const content = readFileSync(filePath, "utf-8");
  const fm = parseFrontmatter(content);

  const structure = scoreStructure(content, fm);
  const triggers = scoreTriggers(fm?.description ?? "");
  const contentScore = scoreContent(content);
  const tokenEfficiency = scoreTokenEfficiency(content);
  const actionability = scoreActionability(content);

  // Weighted total (normalize each dimension to 0-1, then apply weights)
  const total = Math.round(
    (structure / 20) * 20 +
    (triggers / 25) * 25 +
    (contentScore / 25) * 25 +
    (tokenEfficiency / 15) * 15 +
    (actionability / 15) * 15
  );

  const suggestions: string[] = [];
  if (structure < 15) suggestions.push("Add frontmatter with name and description");
  if (triggers < 15) suggestions.push("Add specific trigger phrases in description (quoted strings)");
  if (contentScore < 15) suggestions.push("Add code comparisons (❌/✅) and anti-patterns");
  if (tokenEfficiency < 10) suggestions.push("Move detailed content to references/ folder");
  if (actionability < 10) suggestions.push("Use imperative form (verb-first instructions)");

  return {
    name: fm?.name ?? basename(filePath),
    path: filePath,
    structure,
    triggers,
    content: contentScore,
    tokenEfficiency,
    actionability,
    total,
    grade: getGrade(total),
    suggestions,
  };
}

function getGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

function formatOutput(scores: SkillScore[], format: string): string {
  switch (format) {
    case "json":
      return JSON.stringify(scores, null, 2);

    case "text":
      return scores
        .map(
          (s) =>
            `${s.name}: ${s.total}/100 (${s.grade})\n` +
            s.suggestions.map((sug) => `  → ${sug}`).join("\n")
        )
        .join("\n\n");

    case "table":
    default:
      return formatTable(scores);
  }
}

function formatTable(scores: SkillScore[]): string {
  const header = [
    "",
    "Skill",
    "Struct",
    "Trig",
    "Content",
    "Token",
    "Action",
    "Total",
    "Grade",
  ];

  const rows = scores.map((s) => [
    "",
    s.name.padEnd(25),
    String(s.structure).padStart(5),
    String(s.triggers).padStart(5),
    String(s.content).padStart(5),
    String(s.tokenEfficiency).padStart(5),
    String(s.actionability).padStart(5),
    String(s.total).padStart(5),
    s.grade.padStart(5),
  ]);

  const colWidths = header.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => r[i].length))
  );

  const separator = colWidths.map((w) => "-".repeat(w + 2)).join("+");

  const formatRow = (row: string[]) =>
    " " + row.map((cell, i) => cell.padEnd(colWidths[i])).join(" | ");

  let output = "\n";
  output += formatRow(header) + "\n";
  output += separator + "\n";
  for (const row of rows) {
    output += formatRow(row) + "\n";
  }

  // Average
  const avg = Math.round(scores.reduce((sum, s) => sum + s.total, 0) / scores.length);
  output += `\n  Average: ${avg}/100 (${getGrade(avg)})\n`;

  // Suggestions
  const allSuggestions = scores.flatMap((s) =>
    s.suggestions.map((sug) => `  ${s.name}: ${sug}`)
  );
  if (allSuggestions.length > 0) {
    output += "\n  Suggestions:\n";
    output += allSuggestions.join("\n") + "\n";
  }

  return output;
}
