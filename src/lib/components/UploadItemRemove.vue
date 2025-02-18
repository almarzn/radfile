<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { injectUploadFile, injectState } from "../context";

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

const file = injectUploadFile();
const state = injectState();

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
