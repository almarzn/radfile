import type { UploadFile } from "./context";
import type { UploadMetadata } from "./UploadOptions";

export type UploadHandler<MetadataT extends UploadMetadata> = {
  onUpload: (files: UploadFile<MetadataT>[]) => void;
  onCleanup: () => void;
  onRemove: (file: File) => void;
};

export type UploadCallbacks = {
  onProgress: (file: File, byteSent: number) => void;
  onError: (file: File, error: Error) => void;
  onDone: (file: File) => void;
};

export type CreateUploadHandler<MetadataT extends UploadMetadata> = (callbacks: UploadCallbacks) => UploadHandler<MetadataT>;