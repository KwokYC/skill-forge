# skill-forge

CLI tool to generate, validate, and score [Claude Code](https://claude.ai/code) skills. Stop writing mediocre skills — forge great ones.

[![npm](https://img.shields.io/npm/v/skill-forge)](https://www.npmjs.com/package/skill-forge)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Install

```bash
npm install -g skill-forge
```

Or use directly:

```bash
npx skill-forge generate "Python data pipeline debugging"
npx skill-forge validate ./my-skill/SKILL.md
npx skill-forge score ~/.claude/skills/
```

## Commands

### generate

Create a new skill from a description:

```bash
skill-forge generate "REST API design best practices"
skill-forge generate "React testing patterns" --name react-testing
skill-forge generate "Django security audit" -o ./my-skills
```

Generates a `SKILL.md` with:
- Proper frontmatter (name, description with trigger phrases)
- Structured template (When to Activate, Core Rules, Decision Tree, Anti-Patterns)
- Ready to customize and fill in

### validate

Check a skill for structural issues:

```bash
skill-forge validate ~/.claude/skills/my-skill/SKILL.md
skill-forge validate ./skills/*/SKILL.md --strict
```

Checks:
- Frontmatter completeness (name, description)
- Trigger phrase quality (quoted, specific, 3+ words)
- Body structure (sections, code examples, anti-patterns)
- Writing style (imperative form, not second person)

### score

Rate skill quality on a 100-point scale:

```bash
skill-forge score ~/.claude/skills/my-skill/SKILL.md
skill-forge score ~/.claude/skills/ -f json -o report.json
skill-forge score ./skills/ --min 70
```

Output:

```
  Skill                     | Struct |  Trig | Content | Token | Action | Total | Grade
  --------------------------+--------+-------+---------+-------+--------+-------+------
  code-quality-guard        |    18  |   22  |    20   |   12  |    13  |   85  |    A
  tdd-enforcer              |    20  |   25  |    23   |   10  |    14  |   92  |   A+
  security-scanner          |    15  |   18  |    22   |   14  |    11  |   80  |    A
```

## Scoring System (100 points)

| Dimension | Weight | What it measures |
|-----------|--------|------------------|
| **Structure** | 20 pts | Frontmatter fields, headings, file organization |
| **Triggers** | 25 pts | Specific trigger phrases in description, quantity, quality |
| **Content** | 25 pts | Code examples, ❌/✅ comparisons, decision trees, anti-patterns |
| **Token Efficiency** | 15 pts | Body length, references/ separation, conciseness |
| **Actionability** | 15 pts | Imperative form, commands, checklists, quick reference |

### Grade Scale

| Grade | Score | Meaning |
|-------|-------|---------|
| A+ | 90-100 | Production quality. Ship it. |
| A | 80-89 | Great. Minor improvements possible. |
| B | 70-79 | Good foundation. Needs more examples. |
| C | 60-69 | Acceptable. Missing key elements. |
| D | 50-59 | Below average. Significant gaps. |
| F | 0-49 | Not ready. Start over. |

## Example: Generating a Skill

```bash
$ skill-forge generate "Debug Python async code issues" --name debug-async

✓ Generated skill: debug-async
  📁 ./debug-async/SKILL.md
  🎯 5 trigger phrases

Next steps:
  1. Edit ./debug-async/SKILL.md to add your instructions
  2. Run: skill-forge validate ./debug-async/SKILL.md
  3. Run: skill-forge score ./debug-async/SKILL.md
```

## Example: Scoring Skills

```bash
$ skill-forge score ~/.claude/skills/

  Skill                     | Struct |  Trig | Content | Token | Action | Total | Grade
  --------------------------+--------+-------+---------+-------+--------+-------+------
  smart-commit              |    20  |   25  |    22   |   11  |    13  |   91  |   A+
  api-designer              |    20  |   23  |    24   |   13  |    12  |   92  |   A+
  code-quality-guard        |    18  |   22  |    20   |   12  |    13  |   85  |    A

  Average: 89/100 (A)

  Suggestions:
    code-quality-guard: Add frontmatter with name and description
```

## Related

- [awesome-dev-skills](https://github.com/OWNER/awesome-dev-skills) — 8 production-ready Claude Code skills
- [Claude Code Docs](https://docs.anthropic.com/en/docs/claude-code)

## License

MIT
