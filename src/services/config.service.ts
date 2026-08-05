import Conf from "conf";
import type { AppConfig } from "../types/index.js";
import { DEFAULT_MODEL } from "../constants/index.js";

const store = new Conf<AppConfig>({
  projectName: "whatidid",
  defaults: {
    apiKey: "",
    model: DEFAULT_MODEL,
  },
});

export function getConfig(): AppConfig {
  return store.store;
}

export function getApiKey(): string {
  const key = store.get("apiKey");
  if (!key) {
    throw new Error(
      "No API key configured. Run 'whatidid init' to set up your OpenRouter API key.",
    );
  }
  return key;
}

export function getModel(): string {
  return store.get("model");
}

export function setApiKey(key: string): void {
  store.set("apiKey", key);
}

export function setModel(model: string): void {
  store.set("model", model);
}
