<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { provide, toRefs } from "vue";
import { type UploadFile, uploadFileKey } from "../context.ts";

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

provide(uploadFileKey, toRefs(props).item);
</script>

<template>
  <Primitive v-bind="props" :data-status="item.status.status">
    <slot :status="item.status.status" />
  </Primitive>
</template>
