import type { ReadonlyRefOrGetter } from "@vueuse/core";

export type UploadHandler = {
  onUpload: (files: File[]) => void;
  onCleanup: () => void;
};

export type UploadCallbacks = {
  onProgress: (file: File, byteSent: number) => void;
  onError: (file: File, error: Error) => void;
  onDone: (file: File) => void;
};

export type CreateUploadHandler = (callbacks: UploadCallbacks) => UploadHandler;

export const createDummyUploadHandler: CreateUploadHandler = (callbacks) => {
  const cancelled = {
    value: false,
  };
  return {
    onUpload: (files) => {
      files.forEach((file) => {
        tickProgress(0, {
          onProgress: (value) => {
            if (value >= file.size) {
              return callbacks.onDone(file);
            }
            callbacks.onProgress(file, value);
          },
          isCancelled: () => cancelled.value,
          maxValue: file.size,
        });
      });
    },
    onCleanup: () => {
      cancelled.value = true;
    },
  };
};

function tickProgress(
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
