
export type UploadHandler = {
  onUpload: (files: File[]) => void;
  onCleanup: () => void;
  onRemove: (file: File) => void;
};

export type UploadCallbacks = {
  onProgress: (file: File, byteSent: number) => void;
  onError: (file: File, error: Error) => void;
  onDone: (file: File) => void;
};

export type CreateUploadHandler = (callbacks: UploadCallbacks) => UploadHandler;