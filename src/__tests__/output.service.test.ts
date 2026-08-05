import { describe, it, expect } from "vitest";
import { formatReport, formatMarkdown, formatHtml } from "../services/output.service.js";
import type { AIReport } from "../types/index.js";

const report: AIReport = {
  project: "my-app",
  tasks: [
    "Implemented authentication.",
    "Added route protection.",
    "Fixed profile page bugs.",
  ],
};

describe("output.service", () => {
  describe("formatReport", () => {
    it("includes the project name", () => {
      const output = formatReport(report);
      expect(output).toContain("my-app");
    });

    it("includes all tasks", () => {
      const output = formatReport(report);
      expect(output).toContain("Implemented authentication.");
      expect(output).toContain("Added route protection.");
      expect(output).toContain("Fixed profile page bugs.");
    });

    it("includes bullet points", () => {
      const output = formatReport(report);
      expect(output).toContain("•");
    });
  });

  describe("formatMarkdown", () => {
    it("starts with project name as H1", () => {
      const output = formatMarkdown(report);
      expect(output).toContain("# my-app");
    });

    it("contains list items", () => {
      const output = formatMarkdown(report);
      expect(output).toContain("- Implemented authentication.");
      expect(output).toContain("- Added route protection.");
      expect(output).toContain("- Fixed profile page bugs.");
    });
  });

  describe("formatHtml", () => {
    it("contains html document structure", () => {
      const output = formatHtml(report);
      expect(output).toContain("<!DOCTYPE html>");
      expect(output).toContain("<html");
      expect(output).toContain("<title>my-app - Tasks</title>");
    });

    it("contains list items", () => {
      const output = formatHtml(report);
      expect(output).toContain("<li>Implemented authentication.</li>");
      expect(output).toContain("<li>Added route protection.</li>");
      expect(output).toContain("<li>Fixed profile page bugs.</li>");
    });

    it("escapes HTML in task content", () => {
      const unsafe: AIReport = {
        project: 'test<script>alert("xss")</script>',
        tasks: ['<img src=x onerror=alert(1)>'],
      };
      const output = formatHtml(unsafe);
      expect(output).not.toContain("<script>");
      expect(output).toContain("&lt;script&gt;");
      expect(output).toContain("src=x");
    });
  });

  describe("edReports with empty tasks", () => {
    const emptyReport: AIReport = { project: "empty", tasks: [] };

    it("handles empty tasks gracefully", () => {
      const output = formatReport(emptyReport);
      expect(output).toContain("empty");
      expect(output).not.toContain("•");
    });
  });
});
