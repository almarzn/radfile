<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { inject } from 'vue';
import { uploadFileKey, type UploadFile } from "./context";

const props = withDefaults(
  defineProps<PrimitiveProps & { class?: string }>(),
  {
    as: "span",
    class: "",
  }
);

const file = inject(uploadFileKey) as UploadFile;
</script>

<template>
  <Primitive v-bind="props">
    {{ file.file.name }}
  </Primitive>
</template>
