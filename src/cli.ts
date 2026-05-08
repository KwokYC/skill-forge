import { Command } from "commander";
import { generate } from "./commands/generate.js";
import { validate } from "./commands/validate.js";
import { score } from "./commands/score.js";

const program = new Command();

program
  .name("skill-forge")
  .description("Generate, validate, and score Claude Code skills")
  .version("1.0.0");

program
  .command("generate")
  .description("Generate a new Claude Code skill from a description")
  .argument("<description>", "What the skill should do")
  .option("-n, --name <name>", "Skill name (auto-generated from description if omitted)")
  .option("-o, --output <dir>", "Output directory", ".")
  .option("-t, --triggers <triggers...>", "Custom trigger phrases")
  .action(generate);

program
  .command("validate")
  .description("Validate a Claude Code skill file")
  .argument("<path>", "Path to SKILL.md file")
  .option("--strict", "Enable strict mode (warnings as errors)", false)
  .action(validate);

program
  .command("score")
  .description("Score Claude Code skills for quality")
  .argument("<path>", "Path to SKILL.md file or skills directory")
  .option("-f, --format <format>", "Output format (table|json|text)", "table")
  .option("-o, --output <file>", "Write report to file")
  .option("--min <score>", "Minimum acceptable score (0-100)", "0")
  .action(score);

program.parse();
