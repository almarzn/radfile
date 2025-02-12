<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { computed, provide, reactive, readonly } from "vue";
import type { UploadOptions } from "../UploadOptions.ts";
import {
  type UploadFile,
  uploadOptionsKey,
  uploadStateKey,
} from "./context.ts";

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      class?: string;
      options: UploadOptions<any>;
    }
  >(),
  {
    as: "div",
    class: "",
  }
);

const bindProps = computed(() => {
  const { options: _, ...boundProps } = props;

  return boundProps;
});

provide(uploadOptionsKey, props.options);

const files = reactive<UploadFile[]>([]);

const handler = props.options.createUploadHandler({
  onProgress: (file, progress) => {
    const item = files.find((f) => f.file === file);

    if (!item) throw new Error(`File ${file.name} not found`);

    if (item.status.status !== "pending")
      throw new Error(`File ${file.name} is not pending`);

    item.status = { status: "pending", uploaded: progress };
  },
  onDone: (file) => {
    const item = files.find((f) => f.file === file)!;

    item.status = { status: "success" };
  },
  onError: (file, error) => {
    const item = files.find((f) => f.file === file)!;

    item.status = { status: "error", error };
  },
});

const addFile = (append: File | File[]) => {
  if (!Array.isArray(append)) {
    return addFile([append]);
  }

  return files.push(
    ...append.map((file) => ({
      file,
      id: Math.random().toString(36).slice(2),
      metadata: props.options.getMetadata(),
      status: { status: "idle" as const },
    }))
  );
};

const hasIdle = computed(() => files.some(file => file.status.status === "idle"));
const isUploading = computed(() => files.some(file => file.status.status === "pending"));

provide(uploadStateKey, {
  files: readonly(files),
  addFile,
  hasIdle,
  isUploading,
  removeFile(file) {
    files.splice(files.indexOf(file), 1);
  },
  upload: () => {
    const idleFiles = files.filter(file => file.status.status === "idle");
    idleFiles.forEach(file => {
      file.status = { status: "pending", uploaded: 0 }
    })
    handler.onUpload(idleFiles.map((f) => f.file));
  },
});
</script>

<template>
  <Primitive v-bind="bindProps">
    <slot />
  </Primitive>
</template>
