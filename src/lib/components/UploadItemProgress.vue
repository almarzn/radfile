<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { computed } from "vue";
import { injectUploadFile } from "../context";

interface Props extends PrimitiveProps {
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  as: "div",
  class: "",
});

const file = injectUploadFile();

const progress = computed(() => {
  if (file.value.status.status === "pending") {
    return file.value.status.uploaded / file.value.file.size;
  }

  if (file.value.status.status === "success") {
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
