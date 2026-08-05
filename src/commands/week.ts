import ora from "ora";
import { isGitRepo, getProjectName, getWeeksCommits } from "../services/git.service.js";
import { getApiKey, getModel } from "../services/config.service.js";
import { generateReport } from "../services/ai.service.js";
import { formatReport } from "../services/output.service.js";
import { logError } from "../utils/logger.js";
import { startShimmer, stopShimmer } from "../utils/shimmer.js";

export async function weekCommand(): Promise<void> {
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

  const spinner = ora("Fetching this week's commits...").start();

  const commits = await getWeeksCommits();
  if (commits.length === 0) {
    spinner.warn("No commits found for the past 7 days.");
    return;
  }

  const projectName = getProjectName();
  spinner.stop();

  startShimmer();

  try {
    const report = await generateReport(commits, projectName, { apiKey, model }, true);

    stopShimmer();
    console.log("");
    console.log(formatReport(report));
  } catch (err) {
    stopShimmer();
    logError(err instanceof Error ? err.message : "Unknown error");
    process.exit(1);
  }
}
