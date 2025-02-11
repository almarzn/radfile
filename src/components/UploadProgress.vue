<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { inject, computed } from "vue";
import { uploadStateKey, type UploadFile, type UploadFileProgressStatus, type UploadState } from "./context";

interface Props extends PrimitiveProps {
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  as: "div",
  class: "",
});

const state = inject(uploadStateKey) as UploadState;

const progress = computed(() => {
  const files = state.files;

  const pendingFiles = files.filter((file): file is UploadFile<UploadFileProgressStatus> => file.status.status === "pending");
  if (pendingFiles.length === 0) return null;

  const totalSent = pendingFiles.reduce((sum, file) => {
    return sum + file.status.uploaded;
  }, 0);

  const totalSize = pendingFiles.reduce((sum, file) => {
    return sum + file.file.size;
  }, 0);

  return totalSent / totalSize;
});

const totalFiles = computed(() => state.files.length);

const pendingCount = computed(() => 
  state.files.filter(file => file.status.status === "pending").length
);

const successCount = computed(() => 
  state.files.filter(file => file.status.status === "success").length
);

const errorCount = computed(() => 
  state.files.filter(file => file.status.status === "error").length
);
</script>

<template>
  <Primitive v-if="progress !== null" v-bind="props">
    <slot 
      :progress="progress"
      :total-files="totalFiles"
      :pending-count="pendingCount"
      :success-count="successCount"
      :error-count="errorCount"
    >
      {{ progress.toLocaleString(undefined, { style: "percent" }) }}
    </slot>
  </Primitive>
</template>
