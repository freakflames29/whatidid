import chalk from "chalk";

export function logError(message: string): void {
  console.error(chalk.red("✖"), message);
}

export function logSuccess(message: string): void {
  console.log(chalk.green("✔"), message);
}

export function logInfo(message: string): void {
  console.log(chalk.blue("ℹ"), message);
}

export function logWarn(message: string): void {
  console.warn(chalk.yellow("⚠"), message);
}
