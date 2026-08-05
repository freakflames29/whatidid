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

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export async function getTodaysCommits(): Promise<CommitInfo[]> {
  const git = simpleGit();
  const today = formatDate(new Date());

  const log = await git.log({
    "--since": `${today} 00:00:00`,
    "--until": `${today} 23:59:59`,
    "--format": "%H||%s||%ai",
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
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const log = await git.log({
    "--since": `${formatDate(sevenDaysAgo)} 00:00:00`,
    "--until": `${formatDate(today)} 23:59:59`,
    "--format": "%H||%s||%ai",
    "--no-merges": null,
    maxCount: MAX_WEEK_COMMITS,
  });

  return log.all.map((entry) => ({
    hash: entry.hash,
    message: entry.message,
    date: entry.date,
  }));
}
