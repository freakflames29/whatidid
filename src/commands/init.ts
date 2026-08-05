import inquirer from "inquirer";
import ora from "ora";
import { setApiKey, setModel } from "../services/config.service.js";
import { DEFAULT_MODEL } from "../constants/index.js";
import { logSuccess } from "../utils/logger.js";

export async function initCommand(): Promise<void> {
  console.log("");
  const answers = await inquirer.prompt([
    {
      type: "password",
      name: "apiKey",
      message: "Enter your OpenRouter API key:",
      mask: "*",
      validate: (input: string) => {
        if (!input.trim()) return "API key is required";
        if (!input.startsWith("sk-or-"))
          return "API key should start with 'sk-or-'";
        return true;
      },
    },
    {
      type: "list",
      name: "model",
      message: "Choose a model:",
      default: DEFAULT_MODEL,
      choices: [
        "openai/gpt-oss-20b",
        "openai/gpt-oss-120b",
        "google/gemini-2.5-flash",
        "qwen/qwen3-coder",
        "deepseek/deepseek-chat-v3",
      ],
    },
  ]);

  const spinner = ora("Saving configuration...").start();
  setApiKey(answers.apiKey);
  setModel(answers.model);
  spinner.succeed("Configuration saved");

  logSuccess(`whatidid is ready! Run 'whatidid today' to generate your first report.`);
}
