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
import type { UploadOptions } from "./UploadOptions";

const options: UploadOptions<{}> = {
  getMetadata: () => ({}),
  onPickError: (e) => {
    console.error("Error selecting file:", e);
  },
  onUploadError: () => {},
  onSuccess: () => {},
  restrictions: {
    allowMultiple: true,
    accept: [
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
  <UploadRoot :options="options">
    <UploadDropZone class="dropzone">
      <UploadEmptyState class="dropzone__empty-state">
        Drop a file or click here to select a file
      </UploadEmptyState>
      <UploadFileButton class="dropzone__button" />
      <UploadFiles v-slot="{ files }" class="dropzone__files">
        <UploadItem v-for="file in files" :key="file.id" :item="file" class="files__item">
          <UploadItemPreview class="item__preview"/>
          <div class="item__footer">
            <div class="footer__details">
              <UploadItemName class="item__name"/>
              <UploadItemProgress class="item__progress"/>
              <UploadItemErrorMessage class="item__error"/>
              <UploadItemSize class="item__size"/>
            </div>
            
            <UploadItemRemove class="item__remove">
              &times;
            </UploadItemRemove>
          </div>
        </UploadItem>
      </UploadFiles>
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
