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

const progress = computed(() => {
  if (file.status.status === "pending") {
    return file.status.uploaded / file.file.size;
  }
  
  return null;
});
</script>

<template>
  <Primitive v-if="progress !== null" v-bind="props">
    <slot :progress="progress">
      {{ progress.toLocaleString(undefined, { style: "percent" }) }}
    </slot>
  </Primitive>
</template>
