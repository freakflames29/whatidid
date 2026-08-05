import fs from "node:fs";
import path from "node:path";
import { simpleGit } from "simple-git";
import type { CommitInfo } from "../types/index.js";
import { MAX_COMMITS, MAX_WEEK_COMMITS } from "../constants/index.js";

export function isGitRepo(): boolean {
  const gitPath = path.join(process.cwd(), ".git");
  return fs.existsSync(gitPath);
}

export function getProjectName(): string {
  return path.basename(process.cwd());
}

export async function getTodaysCommits(): Promise<CommitInfo[]> {
  const git = simpleGit();

  const log = await git.log({
    "--since": "midnight",
    "--no-merges": null,
    maxCount: MAX_COMMITS,
  });

  return log.all.map((entry) => ({
    hash: entry.hash,
    message: entry.message,
    date: entry.date,
  }));
}

export async function getWeeksCommits(): Promise<CommitInfo[]> {
  const git = simpleGit();

  const log = await git.log({
    "--since": "7.days.ago",
    "--no-merges": null,
    maxCount: MAX_WEEK_COMMITS,
  });

  return log.all.map((entry) => ({
    hash: entry.hash,
    message: entry.message,
    date: entry.date,
  }));
}
