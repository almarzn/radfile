import type { InjectionKey } from "vue";
import { inject } from "vue";
import type { UploadMetadata, UploadOptions } from "../UploadOptions.ts";

export const uploadOptionsKey = Symbol() as InjectionKey<UploadOptions<any>>;

export const useUploadOptions = () => {
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

export type UploadFile<TStatus extends UploadFileStatus = UploadFileStatus> =  {
  id: string;
  metadata: UploadMetadata;
  file: File;
  status: TStatus;
};

export type UploadState = {
  files: ReadonlyArray<UploadFile>;

  addFile: (file: File | File[]) => void;
  removeFile: (file: UploadFile) => void;
};

export const uploadStateKey = Symbol() as InjectionKey<UploadState>;

export const useUploadState = () => {
  return inject(uploadStateKey)!;
};

export const uploadFileKey = Symbol() as InjectionKey<UploadFile>;

export const useUploadFile = () => {
  return inject(uploadFileKey)!;
};
