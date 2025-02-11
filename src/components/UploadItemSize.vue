<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { inject } from 'vue';
import { uploadFileKey, type UploadFile } from "./context";

const props = withDefaults(
  defineProps<PrimitiveProps>(),
  {
    as: "span",
    class: "",
  }
);

const file = inject(uploadFileKey) as UploadFile;

function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

const formattedSize = formatFileSize(file.file.size);
const bytes = file.file.size;
</script>

<template>
  <Primitive v-bind="props">
    <slot :size="formattedSize" :bytes="bytes">
      {{ formattedSize }}
    </slot>
  </Primitive>
</template>
