<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { injectUploadFile } from "../context";
import { computed } from "vue";

const props = withDefaults(
  defineProps<PrimitiveProps>(),
  {
    as: "span",
    class: "",
  }
);

const file = injectUploadFile();

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

const formattedSize = formatFileSize(file.value.file.size);
const bytes = computed(() => file.value.file.size)
</script>

<template>
  <Primitive v-bind="props">
    <slot :size="formattedSize" :bytes="bytes">
      {{ formattedSize }}
    </slot>
  </Primitive>
</template>
