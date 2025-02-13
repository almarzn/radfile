<script setup lang="ts">
import {
  UploadFiles,
  UploadRoot,
  UploadFileButton,
  UploadDropZone,
  UploadItem,
  UploadItemErrorMessage,
  UploadItemPreview,
  UploadItemProgress,
  UploadItemRemove,
  UploadItemName,
  UploadItemSize,
  UploadEmptyState,
} from "./components";
import UploadStartUploadButton from "./components/UploadStartUploadButton.vue";
import { createDummyUploadHandler } from "./UploadHandler";
import type { UploadOptions } from "./UploadOptions";

const options: UploadOptions<{}> = {
  getMetadata: () => ({}),
  onPickError: (e) => {
    console.error("Error selecting file:", e);
  },
  onUploadError: () => {},
  onSuccess: () => {},
  createUploadHandler: createDummyUploadHandler,
  restrictions: {
    allowMultiple: true,
    allowedFileTypes: [
      {
        description: "Images",
        accept: {
          "image/*": [".jpeg", ".png", ".jpg"],
        },
      },
      {
        description: "Documents",
        accept: {
          "application/pdf": [".pdf"],
        },
      },
    ],
  },
};
</script>

<template>
  <UploadRoot
    v-slot="{ hasFiles }"
    :options="options"
    class="h-screen flex items-center justify-center text-gray-500 dark:text-gray-400"
  >
    <UploadDropZone
      class="border-2 border-gray-200 dark:border-gray-800 rounded-lg px-6 py-5 cursor-pointer flex items-center flex-col gap-4"
    >
      <UploadEmptyState class="">
        Drop a file or click here to select a file
      </UploadEmptyState>
      <UploadFileButton
        class="border border-gray-200 dark:border-gray-800 rounded-md px-2 py-1 cursor-pointer text-xs"
      />
      <UploadFiles
        v-slot="{ files }"
        class="flex flex-wrap gap-3 max-w-2xl justify-center"
      >
        <UploadItem
          v-for="file in files"
          v-slot="{ status }"
          :key="file.id"
          :item="file"
          class="flex items-center w-68 flex-col bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <UploadItemPreview
            v-slot="{ preview }"
            class="flex flex-col w-full relative"
          >
            <UploadItemProgress
              v-slot="{ progress }"
              class="absolute top-0 w-full bg-gray-300 dark:bg-gray-700 h-1 overflow-hidden z-100"
            >
              <div
                class="bg-blue-500 h-full transition-all duration-200"
                :style="`width: ${progress * 100}%;`"
              ></div>
            </UploadItemProgress>
            <div
              v-if="preview.type === 'image'"
              class="bg-cover bg-center overflow-hidden  border-b border-gray-200 dark:border-gray-700"
              :style="`background-image: url(${preview.url})`"
            >
              <div class="flex justify-center size-full backdrop-blur-xl">
                <img
                  :src="preview.url"
                  :alt="preview.alt"
                  class="max-h-40 max-w-full shadow-md"
                />
              </div>
            </div>

            <div
              class="flex flex-col p-2 bg-gray-100 dark:bg-gray-800 w-full whitespace-nowrap"
            >
              <UploadItemName
                class="text-ellipsis w-full overflow-hidden text-sm"
              />
              <UploadItemErrorMessage class="item__error" />
              <div class="flex">
                <UploadItemSize
                  class="text-xs text-gray-400 dark:text-gray-600"
                />
                <div class="grow"></div>
                <div
                  v-if="status === 'success'"
                  class="text-xs text-green-500 dark:text-green-700"
                >
                  &#x2713; Uploaded
                </div>
                <div
                  v-if="status === 'pending'"
                  class="text-xs text-blue-500 dark:text-blue-00"
                >
                  Uploading...
                </div>
              </div>
            </div>

            <UploadItemRemove
              class="absolute top-2 right-2 flex items-center justify-center border bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-full size-6 leading-0 cursor-pointer pb-0.5"
            >
              &times;
            </UploadItemRemove>
          </UploadItemPreview>
        </UploadItem>
      </UploadFiles>

      <UploadStartUploadButton
        v-if="hasFiles"
        class="px-4 py-2 rounded-full bg-blue-700 text-white text-sm cursor-pointer disabled:opacity-50"
      />
    </UploadDropZone>
  </UploadRoot>
</template>

<style>
.dropzone__empty-state {
  color: #888;
}

.dropzone {
  border: dashed 2px #ddd;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &[data-dropping] {
    border-color: blue;
  }
}

.item__preview > img {
  height: 100%;
}

.item__preview {
  height: 320px;
}

.files__item {
  border: solid 1px #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.dropzone__files {
  display: flex;
  gap: 12px;
}

.item__footer {
  display: flex;
  gap: 8px;
  max-width: 296px;
  border-top: solid 1px #ddd;
  padding: 6px 12px;
}

.footer__details {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: start;
  flex-grow: 1;
  min-width: 0;
}

span.item__name {
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
  text-align: start;
}

span.item__size {
  color: #999;
  font-size: 12px;
}
</style>
