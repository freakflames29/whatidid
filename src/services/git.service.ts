import fs from "node:fs";
import path from "node:path";
import { simpleGit } from "simple-git";
import type { CommitInfo } from "../types/index.js";
import { MAX_WEEK_COMMITS } from "../constants/index.js";

export function isGitRepo(): boolean {
  const gitPath = path.join(process.cwd(), ".git");
  return fs.existsSync(gitPath);
}

const TRIVIAL_COMMIT_PATTERNS = [
  /^\s*(fix|update|temp|wip|test|chore|typo|refactor|cleanup|nit|minor|docs|build)\s*[:.!-]?\s*$/i,
  /(typo\s*(fix|fixed)|fix(?:ed)?\s+typo)/i,
  /renam(?:e|ed)\s+(?:a\s+)?(?:variable|function|method|file)/i,
  /graph(?:ify)?\s*update/i,
  /^\s*graphify\s*$/i,
];

export function isTrivialCommit(message: string): boolean {
  return TRIVIAL_COMMIT_PATTERNS.some((pattern) => pattern.test(message));
}

export function getProjectName(): string {
  return path.basename(process.cwd());
}

export async function getTodaysCommits(): Promise<CommitInfo[]> {
  const git = simpleGit();

  const log = await git.log({
    "--since": "midnight",
    "--no-merges": null,
  });

  return log.all
    .filter((entry) => !isTrivialCommit(entry.message))
    .map((entry) => ({
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
  });

  return log.all
    .filter((entry) => !isTrivialCommit(entry.message))
    .slice(0, MAX_WEEK_COMMITS)
    .map((entry) => ({
      hash: entry.hash,
      message: entry.message,
      date: entry.date,
    }));
}
