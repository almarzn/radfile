<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { computed, provide, reactive, readonly } from "vue";
import type { UploadOptions } from "../UploadOptions.ts";
import {
  type UploadFile,
  uploadOptionsKey,
  uploadStateKey
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
  },
);

const bindProps = computed(() => {
  const { options: _, ...boundProps } = props;

  return boundProps;
});

provide(uploadOptionsKey, props.options);

const files = reactive<UploadFile[]>([]);

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
    })),
  );
};

provide(uploadStateKey, {
  files: readonly(files),
  addFile,
  removeFile(file) {
    files.splice(files.indexOf(file), 1);
  }
});
</script>

<template>
  <Primitive v-bind="bindProps">
    <slot />
  </Primitive>
</template>
