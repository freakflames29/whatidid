#!/usr/bin/env node
import { program } from "commander";
import { initCommand } from "./commands/init.js";
import { todayCommand } from "./commands/today.js";
import { weekCommand } from "./commands/week.js";
import { exportCommand } from "./commands/export.js";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, "..", "package.json"), "utf-8"));

program
  .name("whatidid")
  .description("Transform Git commit history into a clean, professional task report using AI")
  .version(pkg.version);

program
  .command("init")
  .description("Configure your OpenRouter API key and model")
  .action(initCommand);

program
  .command("today")
  .description("Generate a report from today's commits")
  .action(todayCommand);

program
  .command("week")
  .description("Generate a weekly report from the past 7 days")
  .action(weekCommand);

program
  .command("export")
  .description("Export today's report to Markdown, HTML, or JSON")
  .action(exportCommand);

program.parse();
