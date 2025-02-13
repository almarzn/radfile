<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { provide } from "vue";
import { type UploadFile, uploadFileKey } from "./context.ts";

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      item: UploadFile;
    }
  >(),
  {
    as: "div",
    class: "",
  }
);

provide(uploadFileKey, props.item);
</script>

<template>
  <Primitive v-bind="props">
    <slot :status="item.status.status" />
  </Primitive>
</template>
