<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { useUploadFile, useUploadState } from "./context";

interface Props extends PrimitiveProps {
  class?: string;
}

const props = withDefaults(
  defineProps<Props>(),
  {
    as: "button",
    class: "",
  }
);

const file = useUploadFile();
const state = useUploadState();

function remove() {
  state.removeFile(file.value);
}
</script>

<template>
  <Primitive 
    v-bind="props"
    @click="remove"
  >
    <slot>
      Remove
    </slot>
  </Primitive>
</template>
