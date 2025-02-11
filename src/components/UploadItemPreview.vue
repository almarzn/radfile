<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { inject, computed, ref, onMounted, onBeforeUnmount } from "vue";
import { uploadFileKey, type UploadFile } from "./context";

type ImagePreview = {
  type: "image";
  url: string;
  alt: string;
};

type GenericPreview = {
  type: "generic";
  fileType: string;
};

type Preview = ImagePreview | GenericPreview;

interface Props extends PrimitiveProps {
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  as: "div",
  class: "",
});

const file = inject(uploadFileKey) as UploadFile;
const previewUrl = ref<string | null>(null);

onMounted(() => {
  if (file.file.type.startsWith("image/")) {
    previewUrl.value = URL.createObjectURL(file.file);
  }
});

onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});

const preview = computed<Preview>(() => {
  if (file.file.type.startsWith("image/") && previewUrl.value) {
    return {
      type: "image",
      url: previewUrl.value,
      alt: file.file.name
    };
  }
  return {
    type: "generic",
    fileType: file.file.type.split("/")[0]
  };
});
</script>

<template>
  <Primitive v-bind="props">
    <slot :preview="preview">
      <template v-if="preview.type === 'image'">
        <img :src="preview.url" :alt="preview.alt" />
      </template>
      <template v-else>
        {{ preview.fileType }}
      </template>
    </slot>
  </Primitive>
</template>
