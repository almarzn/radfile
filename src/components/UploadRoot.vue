<script setup lang="ts" generic="MetadataT extends UploadMetadata">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { computed, onUnmounted, provide, reactive, readonly, type UnwrapRef } from "vue";
import type { UploadMetadata, UploadOptions } from "../UploadOptions.ts";
import {
  type UploadFile,
  uploadOptionsKey,
  uploadStateKey,
} from "./context.ts";

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

const files = reactive<UploadFile<MetadataT>[]>([]);

const emitUpdatedModelValue = () => {
  emit(
    "update:modelValue",
    files.map((f) =>f as UploadFile<MetadataT>)
  );
};

const handler = props.options.createUploadHandler({
  onProgress: (file, progress) => {
    const item = files.find((f) => f.file === file);

    if (!item) throw new Error(`File ${file.name} not found`);

    if (item.status.status !== "pending")
      throw new Error(`File ${file.name} is not pending`);

    item.status = { status: "pending", uploaded: progress };

    emitUpdatedModelValue();
  },
  onDone: (file) => {
    const item = files.find((f) => f.file === file)!;

    item.status = { status: "success" };

    emitUpdatedModelValue();
  },
  onError: (file, error) => {
    const item = files.find((f) => f.file === file)!;

    item.status = { status: "error", error };

    emitUpdatedModelValue();
  },
});

const addFile = (append: File | File[]) => {
  if (!Array.isArray(append)) {
    return addFile([append]);
  }

  if (append.length === 0) return;

  if (props.options.restrictions.allowMultiple) {
    const filesToAdd = append.map((file) => ({
      file,
      id: Math.random().toString(36).slice(2),
      metadata: props.options.getMetadata() as UnwrapRef<MetadataT>,
      status: { status: "idle" as const },
    }));

    files.push(...filesToAdd);

    emitUpdatedModelValue();

    return;
  }

  if (files.length > 1) {
    throw new Error("Maximum number of files exceeded");
  }

  files.splice(0, 1, {
    file: append[0],
    id: Math.random().toString(36).slice(2),
    metadata: props.options.getMetadata() as UnwrapRef<MetadataT>,
    status: { status: "idle" as const },
  });

  emitUpdatedModelValue();
};

const hasIdle = computed(() =>
  files.some((file) => file.status.status === "idle")
);
const hasFiles = computed(() => files.length > 0);
const isUploading = computed(() =>
  files.some((file) => file.status.status === "pending")
);

provide(uploadStateKey, {
  files: readonly(files),
  addFile,
  hasIdle,
  hasFiles,
  isUploading,
  removeFile(file) {
    files.splice(files.indexOf(file), 1);

    emitUpdatedModelValue();
  },
  upload: () => {
    const idleFiles = files.filter((file) => file.status.status === "idle");

    idleFiles.forEach((file) => {
      file.status = { status: "pending", uploaded: 0 };
    });

    handler.onUpload(idleFiles.map((f) => f.file));

    emitUpdatedModelValue();
  },
});

onUnmounted(() => {
  handler.onCleanup();
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
