import { z } from "zod";
import { OpenRouter } from "@openrouter/sdk";
import type { AppConfig, AIReport, CommitInfo } from "../types/index.js";
import { AI_PROMPT_TEMPLATE, WEEKLY_PROMPT_TEMPLATE, MAX_RETRIES, RETRY_BASE_DELAY_MS } from "../constants/index.js";

const aiReportSchema = z.object({
  project: z.string(),
  tasks: z.array(z.string()),
});

function buildPrompt(projectName: string, commits: CommitInfo[], weekly: boolean): string {
  const template = weekly ? WEEKLY_PROMPT_TEMPLATE : AI_PROMPT_TEMPLATE;
  const commitList = commits.map((c) => c.message).join("\n");
  return template.replace("{{project_name}}", projectName).replace("{{commit_messages}}", commitList);
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function consumeResponse(response: unknown): Promise<unknown> {
  if (response == null) {
    throw new Error("Invalid AI response: empty");
  }

  if (typeof response === "object" && response !== null && Symbol.asyncIterator in Object(response)) {
    const chunks: unknown[] = [];
    for await (const chunk of response as AsyncIterable<unknown>) {
      chunks.push(chunk);
    }
    return chunks.length === 1 ? chunks[0] : chunks;
  }

  return response;
}

async function parseAIResponse(response: unknown): Promise<AIReport> {
  const resolved = await consumeResponse(response);

  if (!resolved || typeof resolved !== "object") {
    throw new Error("Invalid AI response: not an object");
  }

  const resp = resolved as Record<string, unknown>;
  const choices = resp.choices as Array<{ message?: { content?: string } }> | undefined;

  if (!choices || choices.length === 0) {
    throw new Error("Invalid AI response: no choices");
  }

  const content = choices[0]?.message?.content;
  if (!content) {
    throw new Error("Invalid AI response: no content");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(`AI response was not valid JSON: ${content.slice(0, 200)}`);
  }

  const result = aiReportSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`AI response did not match expected schema: ${result.error.message}`);
  }

  return result.data;
}

export async function generateReport(
  commits: CommitInfo[],
  projectName: string,
  config: AppConfig,
  weekly = false,
): Promise<AIReport> {
  const client = new OpenRouter({
    apiKey: config.apiKey,
  });

  const prompt = buildPrompt(projectName, commits, weekly);

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await client.chat.send({
        model: config.model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        stream: false,
      });

      return await parseAIResponse(response);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      const message = lastError.message.toLowerCase();

      if (message.includes("401") || message.includes("unauthorized") || message.includes("invalid api key")) {
        throw new Error("Invalid OpenRouter API key. Run 'whatidid init' to reconfigure.");
      }

      if (message.includes("429") || message.includes("rate limit")) {
        throw new Error("OpenRouter rate limit reached. Please try again later.");
      }

      if (message.includes("model") && (message.includes("not found") || message.includes("invalid"))) {
        throw new Error(`Model '${config.model}' is not available. Run 'whatidid init' to choose a different model.`);
      }

      if (message.includes("invalid ai response") || message.includes("not valid json") || message.includes("did not match expected schema")) {
        throw lastError;
      }

      if (attempt < MAX_RETRIES) {
        const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
        await sleep(delay);
      }
    }
  }

  throw lastError ?? new Error("Failed to generate report after multiple attempts");
}
