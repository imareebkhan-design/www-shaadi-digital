export interface AutoSaveManager {
  start: () => void;
  stop: () => void;
  trigger: () => Promise<void>;
  getLastError: () => Error | null;
}

const BACKUP_KEY = "invitation_draft_backup";
const BACKUP_METADATA_KEY = "invitation_draft_metadata";

export const createAutoSaveManager = (
  saveFn: () => Promise<void>,
  intervalMs = 30_000,
): AutoSaveManager => {
  let timer: ReturnType<typeof setInterval> | null = null;
  let running = false;
  let lastError: Error | null = null;
  let retryCount = 0;
  const MAX_RETRIES = 3;

  const exponentialBackoff = (attempt: number) => Math.min(1000 * Math.pow(2, attempt), 30000);

  const trigger = async () => {
    try {
      await saveFn();
      retryCount = 0;
      lastError = null;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      retryCount = Math.min(retryCount + 1, MAX_RETRIES);
      
      if (retryCount < MAX_RETRIES) {
        const backoffMs = exponentialBackoff(retryCount);
        console.warn(`Autosave failed (attempt ${retryCount}/${MAX_RETRIES}), retrying in ${backoffMs}ms`);
        setTimeout(() => void trigger(), backoffMs);
      } else {
        console.error(`Autosave failed after ${MAX_RETRIES} retries. Changes may not be persisted.`);
      }
    }
  };

  const start = () => {
    if (running) return;
    running = true;
    timer = setInterval(() => {
      void trigger();
    }, intervalMs);
  };

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    running = false;
  };

  const getLastError = () => lastError;

  return { start, stop, trigger, getLastError };
};
