<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { useUploadFile } from "./context";

const props = withDefaults(
  defineProps<PrimitiveProps & { class?: string }>(),
  {
    as: "span",
    class: "",
  }
);

const file = useUploadFile();
</script>

<template>
  <Primitive v-bind="props">
    {{ file.file.name }}
  </Primitive>
</template>
