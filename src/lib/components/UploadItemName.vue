<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { injectUploadFile } from "../context";

const props = withDefaults(
  defineProps<PrimitiveProps & { class?: string }>(),
  {
    as: "span",
    class: "",
  }
);

const file = injectUploadFile();
</script>

<template>
  <Primitive v-bind="props">
    {{ file.file.name }}
  </Primitive>
</template>
