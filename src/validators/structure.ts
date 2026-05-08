import YAML from "yaml";

interface Frontmatter {
  name?: string;
  description?: string;
  version?: string;
  [key: string]: unknown;
}

export function parseFrontmatter(content: string): Frontmatter | null {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  try {
    return YAML.parse(match[1]) as Frontmatter;
  } catch {
    return null;
  }
}

export function hasFrontmatter(content: string): boolean {
  return content.startsWith("---\n") || content.startsWith("---\r\n");
}

export function getBody(content: string): string {
  const match = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/);
  return match ? match[1] : content;
}
