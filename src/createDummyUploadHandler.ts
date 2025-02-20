import { type CreateUploadHandler } from "./lib";

export const createDummyUploadHandler: CreateUploadHandler<any> = (callbacks) => {
  const cancelled = {
    value: false,
  };
  const removed = new Set<File>();

  return {
    onUpload: (files) => {
      files.forEach(({ file }) => {
        tickProgress(0, {
          onProgress: (value) => {
            if (value >= file.size) {
              return callbacks.onDone(file);
            }
            callbacks.onProgress(file, value);
          },
          isCancelled: () => cancelled.value || removed.has(file),
          maxValue: file.size,
        });
      });
    },
    onCleanup: () => {
      cancelled.value = true;
    },
    onRemove: (file) => {
      removed.add(file);
    },
  };
};

export function tickProgress(
  previousValue: number = 0,
  options: {
    onProgress: (value: number) => void;
    isCancelled: () => boolean;
    maxValue: number;
  }
) {
  return setTimeout(
    () => {
      if (previousValue >= options.maxValue || options.isCancelled()) return;

      const newValue = previousValue + 10000 * Math.random() + 1000;

      options.onProgress(Math.min(options.maxValue, newValue));

      tickProgress(newValue, options);
    },
    Math.random() * 200 + 200
  );
}
