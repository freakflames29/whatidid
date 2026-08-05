import ora from "ora";
import { isGitRepo, getProjectName, getTodaysCommits } from "../services/git.service.js";
import { getApiKey, getModel } from "../services/config.service.js";
import { generateReport } from "../services/ai.service.js";
import { formatReport } from "../services/output.service.js";
import { logError } from "../utils/logger.js";
import { startShimmer, stopShimmer } from "../utils/shimmer.js";

export async function todayCommand(): Promise<void> {
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

  const spinner = ora("Fetching today's commits...").start();

  const commits = await getTodaysCommits();
  if (commits.length === 0) {
    spinner.warn("No commits found for today.");
    return;
  }

  const projectName = getProjectName();
  spinner.stop();

  const shimmerMsg = `Making sense of ${commits.length} commit${commits.length > 1 ? "s" : ""}...`;
  process.stdout.write(shimmerMsg + "\n");
  startShimmer();

  try {
    const report = await generateReport(commits, projectName, {
      apiKey,
      model,
    });

    stopShimmer();
    console.log("");
    console.log(formatReport(report));
  } catch (err) {
    stopShimmer();
    logError(err instanceof Error ? err.message : "Unknown error");
    process.exit(1);
  }
}
