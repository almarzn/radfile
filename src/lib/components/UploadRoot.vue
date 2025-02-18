<script setup lang="ts" generic="MetadataT extends UploadMetadata">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { computed, provide } from "vue";
import { useFileManagement } from "../composables/index.ts";
import { useUploadHandler } from "../composables/useUploadHandler.ts";
import { useUploadState } from "../composables/useUploadState.ts";
import type { UploadMetadata, UploadOptions } from "../UploadOptions.ts";
import { type UploadFile, uploadOptionsKey, uploadStateKey } from "../context.ts";

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      class?: string;
      options: UploadOptions<MetadataT>;
      modelValue?: UploadFile<MetadataT>[];
    }
  >(),
  {
    as: "div",
    class: "",
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: ReadonlyArray<UploadFile<MetadataT>>];
}>();

const bindProps = computed(() => {
  const { options: _, ...boundProps } = props;
  return boundProps;
});

provide(uploadOptionsKey, props.options);

const { files, addFile, removeFile, setStatus, emitUpdatedModelValue } = useFileManagement(
  props.options,
  (files) => emit("update:modelValue", files)
);

const { upload } = useUploadHandler(props.options, files, emitUpdatedModelValue, setStatus);
const { hasIdle, hasFiles, isUploading } = useUploadState(files);

provide(uploadStateKey, {
  files,
  addFile,
  hasIdle,
  hasFiles,
  isUploading,
  removeFile,
  upload,
});
</script>

<template>
  <Primitive v-bind="bindProps">
    <slot
      :has-idle="hasIdle"
      :has-files="hasFiles"
      :is-uploading="isUploading"
    />
  </Primitive>
</template>
