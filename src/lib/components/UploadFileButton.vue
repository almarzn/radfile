<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { computed, ref } from "vue";
import { injectState, injectUploadOptions } from "../context";

type Props = PrimitiveProps;

const props = withDefaults(defineProps<Props>(), {
  as: "button",
  class: "",
});

const state = injectState();
const options = injectUploadOptions();
const fileInput = ref<HTMLInputElement>();

const acceptString = computed(() => {
  if (!options.restrictions.allowedFileTypes) return undefined;
  
  return Object.entries(options.restrictions.allowedFileTypes.reduce((acc, type) => {
    Object.entries(type.accept).forEach(([mime, exts]) => {
      acc[mime] = exts;
    });
    return acc;
  }, {} as Record<string, string[]>))
    .map(([mime, exts]) => [mime, ...exts])
    .flat()
    .join(',');
});

async function handleClick() {
  if ('showOpenFilePicker' in window && window.showOpenFilePicker) {
    try {
      const handles = await window.showOpenFilePicker({
        multiple: options.restrictions.allowMultiple,
        types: options.restrictions.allowedFileTypes
      });
      
      const files = await Promise.all(
        handles.map(handle => handle.getFile())
      );
      
      state.addFile(options.restrictions.allowMultiple ? files : files[0]);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Error selecting file:', err);
        options.onPickError?.(err);
      }
    }
  } else {
    fileInput.value?.click();
  }
}

function handleInputChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  
  const files = Array.from(input.files);
  state.addFile(options.restrictions.allowMultiple ? files : files[0]);
  
  input.value = '';
}
</script>

<template>
  <Primitive v-bind="props" @click="handleClick"> 
    <slot>
      {{ options.restrictions.allowMultiple ? state.files.value.length > 0 ? 'Add more files' : 'Select files' : 'Select file' }}
    </slot>
    
    <input
      ref="fileInput"
      type="file"
      :multiple="options.restrictions.allowMultiple"
      :accept="acceptString"
      @change="handleInputChange"
      style="display: none"
    />
  </Primitive>
</template>
