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
  UploadStartUploadButton,
} from "./components";
import type { UploadOptions } from "./UploadOptions";

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
    };
  },
  getMetadata: () => ({}),
  onPickError: (e) => {
    console.error("Error selecting file:", e);
  },
  onUploadError: () => {},
  onSuccess: () => {},
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
  <UploadRoot :options="options" data-testid="upload-root">
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
