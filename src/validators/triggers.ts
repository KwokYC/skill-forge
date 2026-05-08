interface Issue {
  severity: "error" | "warning";
  message: string;
}

export function validateTriggers(description: string): Issue[] {
  const issues: Issue[] = [];

  if (!description) {
    issues.push({
      severity: "error",
      message: "Description is required for trigger detection",
    });
    return issues;
  }

  // Check for quoted trigger phrases
  const quotedPhrases = description.match(/"([^"]+)"/g) || [];

  if (quotedPhrases.length === 0) {
    issues.push({
      severity: "error",
      message: 'No quoted trigger phrases found. Add phrases like: "review my code", "check for bugs"',
    });
  }

  if (quotedPhrases.length < 2) {
    issues.push({
      severity: "warning",
      message: "Only 1 trigger phrase found. Add 3-5 specific phrases for better auto-triggering.",
    });
  }

  // Check for vague triggers
  const vaguePatterns = [
    "use this when",
    "help with things",
    "do stuff",
    "general purpose",
    "anything related to",
  ];

  for (const pattern of vaguePatterns) {
    if (description.toLowerCase().includes(pattern)) {
      issues.push({
        severity: "warning",
        message: `Vague trigger: "${pattern}". Be specific about when to activate.`,
      });
    }
  }

  // Check trigger phrase quality
  for (const phrase of quotedPhrases) {
    const clean = phrase.replace(/"/g, "");
    if (clean.length < 5) {
      issues.push({
        severity: "warning",
        message: `Very short trigger phrase: ${phrase}. Phrases should be 3+ words.`,
      });
    }
    if (clean.length > 100) {
      issues.push({
        severity: "warning",
        message: `Very long trigger phrase: ${phrase.slice(0, 30)}... Keep under 80 chars.`,
      });
    }
  }

  return issues;
}
