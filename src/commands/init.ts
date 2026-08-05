import inquirer from "inquirer";
import ora from "ora";
import { setApiKey, setModel } from "../services/config.service.js";
import { fetchFreeModels } from "../services/ai.service.js";
import { logSuccess } from "../utils/logger.js";

const PAID_DEFAULTS = [
  "openai/gpt-oss-20b",
  "openai/gpt-oss-120b",
  "google/gemini-2.5-flash",
  "qwen/qwen3-coder",
  "deepseek/deepseek-chat-v3",
];

export async function initCommand(): Promise<void> {
  console.log("");

  const { apiKey } = await inquirer.prompt([
    {
      type: "password",
      name: "apiKey",
      message: "Enter your OpenRouter API key:",
      mask: "*",
      validate: (input: string) => {
        if (!input.trim()) return "API key is required";
        return true;
      },
    },
  ]);

  const spinner = ora("Fetching available models...").start();

  let freeChoices: string[] = [];
  try {
    const freeModels = await fetchFreeModels(apiKey);
    freeChoices = freeModels.map((m) => m.id);
    if (freeChoices.length > 0) {
      spinner.succeed(`Found ${freeChoices.length} free models`);
    } else {
      spinner.warn("No free models found, showing defaults");
    }
  } catch {
    spinner.warn("Could not fetch models, showing defaults");
  }

  const modelChoices = [
    ...(freeChoices.length > 0
      ? [
          new inquirer.Separator("── Free Models ──"),
          ...freeChoices,
          new inquirer.Separator("── Paid Models ──"),
        ]
      : []),
    ...PAID_DEFAULTS,
  ];

  const defaultModel = freeChoices.length > 0 ? freeChoices[0] : PAID_DEFAULTS[0];

  const { model } = await inquirer.prompt([
    {
      type: "list",
      name: "model",
      message: "Choose a model:",
      default: defaultModel,
      choices: modelChoices,
      pageSize: 15,
    },
  ]);

  const saveSpinner = ora("Saving configuration...").start();
  setApiKey(apiKey);
  setModel(model);
  saveSpinner.succeed("Configuration saved");

  logSuccess(`whatidid is ready! Using model: ${model}`);
  logSuccess(`Run 'whatidid today' to generate your first report.`);
}
