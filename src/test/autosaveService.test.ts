import { describe, it, expect, vi } from "vitest";
import { createAutoSaveManager } from "@/services/autosaveService";

describe("autosaveService", () => {
  it("starts and stops the autosave timer", async () => {
    const saveFn = vi.fn(async () => {});
    const manager = createAutoSaveManager(saveFn, 50);

    manager.start();
    await new Promise((resolve) => setTimeout(resolve, 120));
    manager.stop();

    expect(saveFn).toHaveBeenCalled();
  });

  it("can trigger save immediately", async () => {
    const saveFn = vi.fn(async () => {});
    const manager = createAutoSaveManager(saveFn, 1000);

    await manager.trigger();
    expect(saveFn).toHaveBeenCalledTimes(1);
  });
});
