import type { InjectionKey, Ref } from "vue";
import { inject } from "vue";
import type { UploadMetadata, UploadOptions } from "./UploadOptions.ts";

export const uploadOptionsKey = Symbol() as InjectionKey<UploadOptions<any>>;

export const injectUploadOptions = () => {
  return inject(uploadOptionsKey)!;
};

export type UploadFileProgressStatus = {
  status: "pending";
  uploaded: number;
};

export type UploadFileStatus = 
| UploadFileProgressStatus
| { status: "error"; error: unknown }
| { status: "success" }
| { status: "idle" }

export type UploadFile<TMetadata extends UploadMetadata = any, TStatus extends UploadFileStatus = UploadFileStatus> =  {
  id: string;
  metadata: TMetadata;
  file: File;
  status: TStatus;
};

export type UploadState<TMetadata extends UploadMetadata> = {
  files: Readonly<Ref<UploadFile<TMetadata>[]>>;

  isUploading: Readonly<Ref<boolean>>;
  hasIdle: Readonly<Ref<boolean>>;
  hasFiles: Readonly<Ref<boolean>>;

  addFile: (file: File | File[]) => void;
  removeFile: (file: UploadFile<TMetadata>) => void;
  upload: () => void;
};

export const uploadStateKey = Symbol() as InjectionKey<UploadState<any>>;

export const injectState = () => {
  return inject(uploadStateKey)!;
};

export const uploadFileKey = Symbol() as InjectionKey<Ref<UploadFile<any>>>;

export const injectUploadFile = () => {
  return inject(uploadFileKey)!;
};
