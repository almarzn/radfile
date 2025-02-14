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

  if (file.status.status === "success") {
    return 1;
  }
  
  return 0;
});
</script>

<template>
  <Primitive v-bind="props" :data-pending="file.status.status === 'pending' || undefined">
    <slot :progress="progress">
      {{ progress.toLocaleString(undefined, { style: "percent" }) }}
    </slot>
  </Primitive>
</template>
