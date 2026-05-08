# skill-forge

CLI tool to generate, validate, and score [Claude Code](https://claude.ai/code) skills. **Stop writing mediocre skills — forge great ones.**

[![npm](https://img.shields.io/npm/v/skill-forge)](https://www.npmjs.com/package/skill-forge)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/KwokYC/skill-forge?style=social)](https://github.com/KwokYC/skill-forge)

> If this project helps you, please give it a star. It helps others discover it and keeps us motivated to add more features.

## Why skill-forge?

The Claude Code skills ecosystem is growing fast, but quality is inconsistent:
- Skills with vague trigger phrases that never auto-activate
- Missing code examples and anti-patterns
- No way to know if your skill is actually good

**skill-forge** fixes that with three commands: `generate`, `validate`, `score`.

## Install

```bash
npm install -g skill-forge
```

Or skip installation:

```bash
npx skill-forge generate "Python data pipeline debugging"
npx skill-forge validate ./my-skill/SKILL.md
npx skill-forge score ~/.claude/skills/
```

## Commands

### `generate` — Create a new skill

```bash
skill-forge generate "REST API design best practices"
skill-forge generate "React testing patterns" --name react-testing
skill-forge generate "Django security audit" -o ./my-skills
```

Output:
```
✓ Generated skill: react-testing
  📁 ./react-testing/SKILL.md
  🎯 4 trigger phrases

Next steps:
  1. Edit ./react-testing/SKILL.md to add your instructions
  2. Run: skill-forge validate ./react-testing/SKILL.md
  3. Run: skill-forge score ./react-testing/SKILL.md
```

Generates a ready-to-customize `SKILL.md` with proper frontmatter, trigger phrases, and structured template.

### `validate` — Check for issues

```bash
skill-forge validate ~/.claude/skills/my-skill/SKILL.md
skill-forge validate ./skills/ --strict
```

Checks:
- Frontmatter completeness (name, description required)
- Trigger phrase quality (quoted, specific, 3+ words)
- Body structure (sections, code examples, anti-patterns)
- Writing style (imperative form, not second person)

### `score` — Rate quality (0-100)

```bash
skill-forge score ~/.claude/skills/
skill-forge score ~/.claude/skills/ -f json -o report.json
skill-forge score ./skills/ --min 70
```

```
  Skill                     | Struct |  Trig | Content | Token | Action | Total | Grade
  --------------------------+--------+-------+---------+-------+--------+-------+------
  code-quality-guard        |    20  |   25  |    25   |   12  |    10  |   92  |   A+
  security-scanner          |    20  |   25  |    21   |   12  |    15  |   93  |   A+
  tdd-enforcer              |    20  |   25  |    25   |   12  |    10  |   92  |   A+

  Average: 92/100 (A+)
```

## Scoring System

5 dimensions, 100 points total:

| Dimension | Weight | What it measures |
|-----------|--------|------------------|
| **Structure** | 20 pts | Frontmatter fields, headings, file organization |
| **Triggers** | 25 pts | Specific trigger phrases, quantity, quality |
| **Content** | 25 pts | Code examples, ❌/✅ comparisons, anti-patterns |
| **Token Efficiency** | 15 pts | Body length, conciseness, no bloat |
| **Actionability** | 15 pts | Imperative form, commands, checklists, tables |

### Grade Scale

| Grade | Score | Verdict |
|-------|-------|---------|
| A+ | 90-100 | Production quality. Ship it. |
| A | 80-89 | Great. Minor improvements possible. |
| B | 70-79 | Good foundation. Needs more examples. |
| C | 60-69 | Acceptable. Missing key elements. |
| D | 50-59 | Below average. Significant gaps. |
| F | 0-49 | Not ready. Start over. |

## Related Projects

- [awesome-dev-skills](https://github.com/KwokYC/awesome-dev-skills) — 8 production-ready Claude Code skills (scored A+ by skill-forge)
- [Claude Code Docs](https://docs.anthropic.com/en/docs/claude-code)

## License

MIT

---

**Star this repo if you find it useful — it helps others discover these tools!**
