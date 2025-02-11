<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { inject } from 'vue';
import { uploadFileKey, type UploadFile, uploadStateKey, type UploadState } from "./context";

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

const file = inject(uploadFileKey) as UploadFile;
const state = inject(uploadStateKey) as UploadState;

function remove() {
  state.removeFile(file);
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
