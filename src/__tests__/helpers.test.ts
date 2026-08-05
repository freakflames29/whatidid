import { describe, it, expect } from "vitest";
import { pluralize, truncate } from "../utils/helpers.js";

describe("helpers", () => {
  describe("pluralize", () => {
    it("returns singular for count 1", () => {
      expect(pluralize(1, "commit")).toBe("commit");
    });

    it("returns default plural for count > 1", () => {
      expect(pluralize(5, "commit")).toBe("commits");
    });

    it("returns custom plural when provided", () => {
      expect(pluralize(2, "person", "people")).toBe("people");
    });
  });

  describe("truncate", () => {
    it("returns text unchanged when under maxLength", () => {
      expect(truncate("hello", 10)).toBe("hello");
    });

    it("truncates text exceeding maxLength with ellipsis", () => {
      expect(truncate("hello world", 8)).toBe("hello...");
    });
  });
});
