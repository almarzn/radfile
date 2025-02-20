import { type Ref, type UnwrapRef, ref, shallowReadonly } from 'vue';
import type { UploadFile, UploadFileStatus } from '../context';
import type { UploadMetadata, UploadOptions } from '../UploadOptions';

export function useFileManagement<MetadataT extends UploadMetadata>(
  options: UploadOptions<MetadataT>,
  emitValue: (files: ReadonlyArray<UploadFile<MetadataT>>) => void
) {
  const files = ref<UploadFile<MetadataT>[]>([]);

  const emitUpdatedModelValue = () => {
    emitValue(files.value.map((f) => f as UploadFile<MetadataT>));
  };

  const addFile = (append: File | File[]) => {
    if (!Array.isArray(append)) {
      return addFile([append]);
    }

    if (append.length === 0) return;

    if (options.restrictions.allowMultiple) {
      const filesToAdd = append.map((file) => ({
        file,
        id: Math.random().toString(36).slice(2),
        metadata: options.getMetadata(file) as UnwrapRef<MetadataT>,
        status: { status: "idle" as const },
      }));
      
      files.value = [...files.value, ...filesToAdd];

      emitUpdatedModelValue();

      return;
    }

    if (files.value.length > 1) {
      throw new Error("Maximum number of files exceeded");
    }

    files.value = [{
      file: append[0],
      id: Math.random().toString(36).slice(2),
      metadata: options.getMetadata(append[0]) as UnwrapRef<MetadataT>,
      status: { status: "idle" as const },
    }]

    emitUpdatedModelValue();
  };

  const removeFile = (file: UploadFile<MetadataT>) => {
    files.value = files.value.filter((f) => f !== file);
    
    emitUpdatedModelValue();
  };

  const setStatus = (file: UploadFile<MetadataT>, status: UploadFileStatus) => {
    files.value = files.value.map(f => f === file ? { ...f, status } : f)

    emitUpdatedModelValue();
  }

  return {
    files: shallowReadonly(files) as Readonly<Ref<UploadFile<MetadataT>[]>>,
    addFile,
    removeFile,
    setStatus,
    emitUpdatedModelValue,
  };
}
