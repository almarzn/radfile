import { computed, type Ref } from 'vue';
import type { UploadFile } from '../components/context';
import type { UploadMetadata } from '../UploadOptions';

export function useUploadState<MetadataT extends UploadMetadata>(
  files: Readonly<Ref<UploadFile<MetadataT>[]>>
) {
  const hasIdle = computed(() =>
    files.value.some((file) => file.status.status === "idle")
  );
  const hasFiles = computed(() => files.value.length > 0);
  const isUploading = computed(() =>
    files.value.some((file) => file.status.status === "pending")
  );

  return {
    hasIdle,
    hasFiles,
    isUploading,
  };
}
