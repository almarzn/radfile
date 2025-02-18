<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { computed } from "vue";
import { injectState } from "../context";

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      class?: string;
    }
  >(),
  {
    as: "button",
    class: "",
  }
);

const uploadState = injectState();

const bindProps = computed(() => {
  return {
    ...props,
    onClick: () => {
      uploadState.upload();
    },
  };
});

</script>

<template>
  <Primitive v-bind="bindProps" :disabled="uploadState.isUploading.value || !uploadState.hasIdle.value">
    <slot>Start Uploading</slot>
  </Primitive>
</template>
