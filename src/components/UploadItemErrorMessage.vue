<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { inject, computed } from "vue";
import { uploadFileKey, type UploadFile } from "./context";

interface Props extends PrimitiveProps {
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  as: "div",
  class: "",
});

const file = inject(uploadFileKey) as UploadFile;

const error = computed(() => {
  if (file.status.status === "error") {
    return file.status.error instanceof Error 
      ? file.status.error.message 
      : String(file.status.error);
  }
  return null;
});
</script>

<template>
  <Primitive v-if="error" v-bind="props">
    <slot :error="error">
      {{ error }}
    </slot>
  </Primitive>
</template>
