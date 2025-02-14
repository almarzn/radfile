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
import { createDummyUploadHandler } from "./createDummyUploadHandler";
import type { UploadOptions } from "./UploadOptions";

const options: UploadOptions<{}> = {
  autoUpload: true,
  getMetadata: () => ({}),
  onPickError: (e) => {
    console.error("Error selecting file:", e);
  },
  onUploadError: () => {},
  onSuccess: () => {},
  createUploadHandler: createDummyUploadHandler,
  restrictions: {
    allowMultiple: false,
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
      class="border-2 border-gray-200 dark:border-gray-800 rounded-lg px-6 py-5 cursor-pointer flex items-center flex-col gap-4 data-[dropping]:border-blue-500 data-[dropping]:dark:border-blue-500"
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
          class="group flex items-center w-68 flex-col bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <UploadItemPreview
            v-slot="{ preview }"
            class="flex flex-col w-full relative"
          >
            <UploadItemProgress
              v-slot="{ progress }"
              class="group-data-[status=idle]:hidden block absolute top-0 w-full bg-gray-300/60 dark:bg-gray-700/60 backdrop-blur-sm h-1 overflow-hidden z-100 transition-discrete transition-all duration-200 origin-top shadow-md starting:opacity-50 opacity-100 starting:scale-y-0 scale-y-100"
            >
              <div
                class="bg-blue-500 h-full transition-all duration-200 group-data-[status=error]:bg-red-500 group-data-[status=success]:bg-green-600 group-data-[status=success]:dark:bg-green-700"
                :style="`width: ${(progress) * 100}%;`"
              ></div>
            </UploadItemProgress>
            <div
              v-if="preview.type === 'image'"
              class="bg-cover bg-center overflow-hidden border-b border-gray-200 dark:border-gray-700 gradient-mask-b-10"
              :style="`background-image: url(${preview.url})`"
            >
              <div class="flex justify-center size-full backdrop-blur-xl">
                <img
                  :src="preview.url"
                  :alt="preview.alt"
                  class="max-h-40 max-w-full"
                />
              </div>
            </div>

            <div
              class="flex flex-col p-2 pt-0 bg-gray-100 dark:bg-gray-800 w-full whitespace-nowrap"
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
