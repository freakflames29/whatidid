import chalk from "chalk";
import type { AIReport } from "../types/index.js";

const SEPARATOR = chalk.dim("─".repeat(44));

export function formatReport(report: AIReport): string {
  const lines: string[] = [];

  lines.push(SEPARATOR);
  lines.push("");
  lines.push(`${chalk.bold("Project:")} ${chalk.cyan(report.project)}`);
  lines.push("");
  lines.push(chalk.bold("Tasks completed"));
  lines.push("");

  for (const task of report.tasks) {
    lines.push(`  ${chalk.green("•")} ${task}`);
  }

  lines.push("");
  lines.push(SEPARATOR);

  return lines.join("\n");
}

export function formatMarkdown(report: AIReport): string {
  const lines: string[] = [];

  lines.push(`# ${report.project}`);
  lines.push("");
  lines.push("## Tasks completed");
  lines.push("");

  for (const task of report.tasks) {
    lines.push(`- ${task}`);
  }

  return lines.join("\n") + "\n";
}

export function formatHtml(report: AIReport): string {
  const taskItems = report.tasks.map((t) => `  <li>${escapeHtml(t)}</li>`).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(report.project)} - Tasks</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 700px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; }
    h1 { color: #0891b2; }
    ul { padding-left: 1.5rem; }
    li { margin-bottom: 0.5rem; }
  </style>
</head>
<body>
  <h1>${escapeHtml(report.project)}</h1>
  <h2>Tasks completed</h2>
  <ul>
${taskItems}
  </ul>
</body>
</html>
`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
