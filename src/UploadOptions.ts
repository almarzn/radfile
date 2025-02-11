export type UploadMetadata = {
}

export type FileType = {
  description: string;
  accept: Record<string, string[]>;
};

export interface UploadOptions<MetadataT extends UploadMetadata> {
  readonly getMetadata: () => MetadataT;
  readonly onPickError?: (err: unknown) => void;
  readonly onUploadError?: (err: unknown) => void;
  readonly onSuccess?: (upload: MetadataT) => void;
  readonly restrictions: {
    readonly allowMultiple: boolean;
    readonly allowedFileTypes?: FileType[];
  }
}