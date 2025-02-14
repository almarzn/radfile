<script setup lang="ts">
import {
  UploadDropZone,
  UploadEmptyState,
  UploadFileButton,
  UploadFiles,
  UploadItem,
  UploadItemErrorMessage,
  UploadItemName,
  UploadItemPreview,
  UploadItemProgress,
  UploadItemRemove,
  UploadItemSize,
  UploadRoot,
  UploadStartUploadButton,
  type UploadFile,
} from "./components";
import type { UploadOptions } from "./UploadOptions";

const emit = defineEmits<{
  'update:modelValue': [ReadonlyArray<UploadFile<any>>];
}>();

const props = defineProps<{
  allowMultiple: boolean;
}>();

export interface StoryProgressEvent extends CustomEvent {
  detail: {
    progress: number;
  };
}

// Declare custom events
declare global {
  interface WindowEventMap {
    "story:setProgress": StoryProgressEvent;
    "story:onDone": CustomEvent;
  }
}

const options: UploadOptions<{}> = {
  autoUpload: true,
  createUploadHandler: (callbacks) => {
    const filesToUpload: File[] = [];

    window.addEventListener(
      "story:setProgress",
      (event: StoryProgressEvent) => {
        filesToUpload.forEach((file) => {
          callbacks.onProgress(file, event.detail.progress);
        });
      }
    );

    window.addEventListener(
      "story:onDone",
      () => {
        filesToUpload.forEach((file) => {
          callbacks.onDone(file);
        });
      }
    );

    return {
      onUpload: (files: File[]) => {
        filesToUpload.push(...files);
      },
      onCleanup: () => {},
      onRemove: (file) => {
        filesToUpload.splice(filesToUpload.indexOf(file), 1);
      }
    };
  },
  getMetadata: () => ({}),
  onPickError: (e) => {
    console.error("Error selecting file:", e);
  },
  onUploadError: () => {},
  onSuccess: () => {},
  restrictions: {
    allowMultiple: props.allowMultiple,
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
  <UploadRoot :options="options" data-testid="upload-root" @update:modelValue="console.log($event); emit('update:modelValue', $event)">
    <UploadDropZone class="dropzone" data-testid="upload-dropzone">
      <UploadEmptyState
        class="dropzone__empty-state"
        data-testid="upload-empty-state"
      >
        Drop a file or click here to select a file
      </UploadEmptyState>
      <UploadFileButton
        class="dropzone__button"
        data-testid="upload-file-button"
      />
      <UploadFiles
        v-slot="{ files }"
        class="dropzone__files"
        data-testid="upload-files"
      >
        <UploadItem
          v-for="file in files"
          :key="file.id"
          :item="file"
          class="files__item"
          :data-testid="`upload-item-id-${file.id}`"
        >
          <UploadItemPreview
            class="item__preview"
            data-testid="upload-item-preview"
          />
          <div class="item__footer">
            <div class="footer__details">
              <UploadItemName
                class="item__name"
                data-testid="upload-item-name"
              />
              <UploadItemProgress
                class="item__progress"
                data-testid="upload-item-progress"
              />
              <UploadItemErrorMessage
                class="item__error"
                data-testid="upload-item-error"
              />
              <UploadItemSize
                class="item__size"
                data-testid="upload-item-size"
              />
            </div>

            <UploadItemRemove
              class="item__remove"
              data-testid="upload-item-remove"
            >
              &times;
            </UploadItemRemove>
          </div>
        </UploadItem>
      </UploadFiles>
      <UploadStartUploadButton data-testid="upload-start-upload-button" />
    </UploadDropZone>
  </UploadRoot>
</template>

