<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { injectState } from '../context'

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      class?: string;
    }
  >(),
  {
    as: "div",
    class: "",
  },
);

const { files } = injectState()
</script>

<template>
  <Primitive
    v-if="files.length > 0"
    v-bind="props"
  >
    <slot :files="files" />
  </Primitive>
</template>

