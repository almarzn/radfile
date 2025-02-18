<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { useTemplateRef } from "vue";
import { useDropZone } from "@vueuse/core";
import { injectUploadOptions, injectState } from "../context.ts";

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
const options = injectUploadOptions();
const upload = injectState();

const zone = useTemplateRef<HTMLElement>("zone");

const { isOverDropZone } = useDropZone(zone, {
  multiple: options.restrictions.allowMultiple,
  onDrop: (files) => {
    upload.addFile(files ?? []);
  },
});
</script>

<template>
  <Primitive
    v-bind="props"
    ref="zone"
    :data-dropping="isOverDropZone || undefined"
  >
    <slot />
  </Primitive>
</template>
