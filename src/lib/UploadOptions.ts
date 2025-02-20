import type { CreateUploadHandler } from "./UploadHandler";

export type UploadMetadata = object

export type FileType = {
  description: string;
  accept: Record<string, string[]>;
};

export interface UploadOptions<MetadataT extends UploadMetadata> {
  readonly createUploadHandler: CreateUploadHandler<MetadataT>;
  readonly autoUpload: boolean;
  readonly getMetadata: (file: File) => MetadataT;
  readonly onPickError?: (err: unknown) => void;
  readonly onUploadError?: (err: unknown) => void;
  readonly onSuccess?: (upload: MetadataT) => void;
  readonly restrictions: {
    readonly allowMultiple: boolean;
    readonly allowedFileTypes?: FileType[];
  }
}