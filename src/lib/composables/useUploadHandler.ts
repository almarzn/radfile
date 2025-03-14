import { onUnmounted, watch, type Ref } from "vue";
import type { UploadFile, UploadFileStatus } from "../context";
import type { UploadMetadata, UploadOptions } from "../UploadOptions";

export function useUploadHandler<MetadataT extends UploadMetadata>(
  options: UploadOptions<MetadataT>,
  files: Readonly<Ref<UploadFile<MetadataT>[]>>,
  emitUpdatedModelValue: () => void,
  setStatus: (file: UploadFile<MetadataT>, status: UploadFileStatus) => void
) {
  const handler = options.createUploadHandler({
    onProgress: (file, progress) => {
      const item = files.value.find((f) => f.file === file);
      if (!item) throw new Error(`File ${file.name} not found`);
      if (item.status.status !== "pending")
        throw new Error(`File ${file.name} is not pending`);

      setStatus(item, { status: "pending", uploaded: progress });
      emitUpdatedModelValue();
    },
    onDone: (file) => {
      const item = files.value.find((f) => f.file === file)!;
      setStatus(item, { status: "success" });
      emitUpdatedModelValue();

      options.onSuccess?.(item.metadata);
    },
    onError: (file, error) => {
      const item = files.value.find((f) => f.file === file)!;

      setStatus(item, { status: "error", error });

      emitUpdatedModelValue();
      options.onUploadError?.(error);
    },
  });

  const upload = () => {
    const idleFiles = files.value.filter(
      (file) => file.status.status === "idle"
    );

    if (idleFiles.length === 0) {
      return;
    }
    
    idleFiles.forEach((file) => {
      file.status = { status: "pending", uploaded: 0 };
    });
    handler.onUpload(idleFiles);
    emitUpdatedModelValue();
  };

  watch(files, () => {
    if (options.autoUpload) upload();
  });

  onUnmounted(() => {
    handler.onCleanup();
  });

  return { upload, handler };
}
