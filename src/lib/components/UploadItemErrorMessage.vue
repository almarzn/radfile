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

const error = computed(() => {
  if (file.value.status.status === "error") {
    return file.value.status.error instanceof Error
      ? file.value.status.error.message
      : String(file.value.status.error);
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
