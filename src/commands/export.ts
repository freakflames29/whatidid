import fs from "node:fs";
import path from "node:path";
import inquirer from "inquirer";
import ora from "ora";
import { isGitRepo, getProjectName, getTodaysCommits } from "../services/git.service.js";
import { getApiKey, getModel } from "../services/config.service.js";
import { generateReport } from "../services/ai.service.js";
import { formatReport, formatMarkdown, formatHtml } from "../services/output.service.js";
import { logError, logSuccess } from "../utils/logger.js";
import { startShimmer, stopShimmer } from "../utils/shimmer.js";

export async function exportCommand(): Promise<void> {
  if (!isGitRepo()) {
    logError("Not a Git repository. Run this command inside a Git project.");
    process.exit(1);
  }

  let apiKey: string;
  let model: string;
  try {
    apiKey = getApiKey();
    model = getModel();
  } catch (err) {
    logError(
      err instanceof Error
        ? err.message
        : "Configuration error. Run 'whatidid init' to get started.",
    );
    process.exit(1);
  }

  const { format } = await inquirer.prompt([
    {
      type: "list",
      name: "format",
      message: "Export format:",
      choices: ["Terminal (print only)", "Markdown (.md)", "HTML (.html)", "JSON (.json)"],
    },
  ]);

  const spinner = ora("Fetching commits...").start();

  const commits = await getTodaysCommits();
  if (commits.length === 0) {
    spinner.warn("No commits found for today.");
    return;
  }

  const projectName = getProjectName();
  spinner.stop();

  startShimmer();

  try {
    const report = await generateReport(commits, projectName, { apiKey, model });

    stopShimmer();

    let output: string;
    let filename: string;

    switch (format) {
      case "Markdown (.md)":
        output = formatMarkdown(report);
        filename = `${projectName}-tasks.md`;
        break;
      case "HTML (.html)":
        output = formatHtml(report);
        filename = `${projectName}-tasks.html`;
        break;
      case "JSON (.json)":
        output = JSON.stringify(report, null, 2) + "\n";
        filename = `${projectName}-tasks.json`;
        break;
      default:
        console.log("");
        console.log(formatReport(report));
        return;
    }

    const filepath = path.join(process.cwd(), filename);
    fs.writeFileSync(filepath, output);
    logSuccess(`Exported to ${filepath}`);
  } catch (err) {
    stopShimmer();
    logError(err instanceof Error ? err.message : "Unknown error");
    process.exit(1);
  }
}
