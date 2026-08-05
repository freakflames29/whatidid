import { describe, it, expect, vi } from "vitest";

const { mockSend } = vi.hoisted(() => ({
  mockSend: vi.fn(),
}));

vi.mock("@openrouter/sdk", () => ({
  OpenRouter: vi.fn(() => ({
    chat: { send: mockSend },
  })),
}));

import { generateReport } from "../services/ai.service.js";
import type { CommitInfo } from "../types/index.js";

const commits: CommitInfo[] = [
  { hash: "abc123", message: "implement auth", date: "2024-01-01" },
  { hash: "def456", message: "add navigation", date: "2024-01-01" },
];

const config = {
  apiKey: "sk-or-test-key",
  model: "openai/gpt-oss-20b",
};

function responseWith(content: string) {
  return { choices: [{ message: { content } }] };
}

describe("ai.service", () => {
  it("returns report on valid AI response", async () => {
    mockSend.mockImplementation(() =>
      responseWith(JSON.stringify({ project: "my-app", tasks: ["Task A", "Task B"] })),
    );

    const result = await generateReport(commits, "my-app", config);
    expect(result.project).toBe("my-app");
    expect(result.tasks).toEqual(["Task A", "Task B"]);
  });

  it("throws on missing API key", async () => {
    mockSend.mockImplementation(() => {
      throw new Error("401 Unauthorized");
    });

    await expect(generateReport(commits, "my-app", config)).rejects.toThrow(
      "Invalid OpenRouter API key",
    );
  });

  it("throws on rate limit", async () => {
    mockSend.mockImplementation(() => {
      throw new Error("429 rate limit exceeded");
    });

    await expect(generateReport(commits, "my-app", config)).rejects.toThrow(
      "rate limit",
    );
  });

  it("throws on invalid model name", async () => {
    mockSend.mockImplementation(() => {
      throw new Error("Model 'bad-model' is not found");
    });

    await expect(generateReport(commits, "my-app", config)).rejects.toThrow(
      "not available",
    );
  });

  it("retries on transient errors then succeeds", async () => {
    let calls = 0;
    mockSend.mockImplementation(() => {
      calls++;
      if (calls === 1) throw new Error("Network timeout");
      return responseWith(JSON.stringify({ project: "my-app", tasks: ["Fixed things."] }));
    });

    const result = await generateReport(commits, "my-app", config);
    expect(result.tasks).toEqual(["Fixed things."]);
    expect(calls).toBe(2);
  });

  it("throws when response is not valid JSON", async () => {
    mockSend.mockImplementation(() => responseWith("not valid json {{{"));

    await expect(generateReport(commits, "my-app", config)).rejects.toThrow(
      "not valid JSON",
    );
  });

  it("throws when response is missing tasks field", async () => {
    mockSend.mockImplementation(() =>
      responseWith(JSON.stringify({ project: "test" })),
    );

    await expect(generateReport(commits, "my-app", config)).rejects.toThrow(
      "did not match expected schema",
    );
  });
});
