import {
  getRemainingTime,
  isOverdue,
  formatDateTime,
} from "./utils";

describe("Time Utility Functions", () => {
  describe("getRemainingTime", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should return remaining time for future date", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const dueDate = "2026-05-22T10:00:00.000Z"; // 2 days later

      jest.setSystemTime(now);

      const result = getRemainingTime(dueDate);
      expect(result).toContain("2天");
    });

    it("should return hours when less than a day", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const dueDate = "2026-05-20T14:30:00.000Z"; // 4.5 hours later

      jest.setSystemTime(now);

      const result = getRemainingTime(dueDate);
      expect(result).toContain("4小时");
      expect(result).not.toContain("天");
    });

    it("should return minutes when less than an hour", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const dueDate = "2026-05-20T10:45:00.000Z"; // 45 minutes later

      jest.setSystemTime(now);

      const result = getRemainingTime(dueDate);
      expect(result).toContain("45分钟");
      expect(result).not.toContain("天");
      expect(result).not.toContain("小时");
    });

    it("should return '即将到期' when less than 1 minute", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const dueDate = "2026-05-20T10:00:30.000Z"; // 30 seconds later

      jest.setSystemTime(now);

      const result = getRemainingTime(dueDate);
      expect(result).toBe("即将到期");
    });

    it("should return '已到期' when exactly at due date", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const dueDate = "2026-05-20T10:00:00.000Z"; // Same time

      jest.setSystemTime(now);

      const result = getRemainingTime(dueDate);
      expect(result).toBe("已到期");
    });

    it("should return '已过期' for past date", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const dueDate = "2026-05-18T10:00:00.000Z"; // 2 days before

      jest.setSystemTime(now);

      const result = getRemainingTime(dueDate);
      expect(result).toBe("已过期 2天");
    });

    it("should return days and hours for past date", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const dueDate = "2026-05-18T14:30:00.000Z"; // 1 day 19.5 hours before

      jest.setSystemTime(now);

      const result = getRemainingTime(dueDate);
      expect(result).toContain("已过期");
      expect(result).toContain("1天");
      expect(result).toContain("19小时");
    });

    it("should return '无效日期' for invalid date string", () => {
      const result = getRemainingTime("invalid-date");
      expect(result).toBe("无效日期");
    });

    it("should return '无效日期' for empty string", () => {
      const result = getRemainingTime("");
      expect(result).toBe("无效日期");
    });
  });

  describe("isOverdue", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should return true for past date and not completed", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const dueDate = "2026-05-18T10:00:00.000Z";

      jest.setSystemTime(now);

      const result = isOverdue(dueDate, false);
      expect(result).toBe(true);
    });

    it("should return false for past date but completed", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const dueDate = "2026-05-18T10:00:00.000Z";

      jest.setSystemTime(now);

      const result = isOverdue(dueDate, true);
      expect(result).toBe(false);
    });

    it("should return false for future date", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const dueDate = "2026-05-22T10:00:00.000Z";

      jest.setSystemTime(now);

      const result = isOverdue(dueDate, false);
      expect(result).toBe(false);
    });

    it("should return false for completed item regardless of date", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const pastDueDate = "2026-05-18T10:00:00.000Z";

      jest.setSystemTime(now);

      const result = isOverdue(pastDueDate, true);
      expect(result).toBe(false);
    });

    it("should return false for future date and not completed", () => {
      const now = new Date("2026-05-20T10:00:00.000Z");
      const dueDate = "2026-05-22T10:00:00.000Z";

      jest.setSystemTime(now);

      const result = isOverdue(dueDate, false);
      expect(result).toBe(false);
    });
  });

  describe("formatDateTime", () => {
    it("should format ISO date string to readable format", () => {
      const isoDate = "2026-05-20T14:30:45.000Z";
      const result = formatDateTime(isoDate);

      expect(result).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/);
      expect(result).toContain("2026-05-20");
    });

    it("should handle single digit month and day", () => {
      const isoDate = "2026-01-05T09:05:09.000Z";
      const result = formatDateTime(isoDate);

      expect(result).toBe("2026-01-05 09:05");
    });

    it("should handle double digit month and day", () => {
      const isoDate = "2026-12-31T23:59:59.000Z";
      const result = formatDateTime(isoDate);

      expect(result).toBe("2026-12-31 23:59");
    });

    it("should return '无效日期' for invalid date string", () => {
      const result = formatDateTime("invalid-date");
      expect(result).toBe("无效日期");
    });

    it("should return '无效日期' for empty string", () => {
      const result = formatDateTime("");
      expect(result).toBe("无效日期");
    });

    it("should use local timezone", () => {
      const isoDate = "2026-05-20T14:30:00.000Z";
      const result = formatDateTime(isoDate);

      // Just verify it doesn't throw and returns a formatted string
      expect(typeof result).toBe("string");
      expect(result).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/);
    });
  });
});
