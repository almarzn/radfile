# Radfile

A modern, unstyled, and customizable file upload component library for Vue 3, built with [Radix Vue](https://www.radix-vue.com/) primitives.

## Features

- 🚀 **Modern Vue 3 Component**: Built specifically for Vue 3 with TypeScript support
- 🎨 **Customizable**: Highly customizable styling and behavior. You can add any classes to any element, and choose exactly which and where informations are displayed.
- 🔧 **TypeScript**: Written in TypeScript for better developer experience
- 📦 **Lightweight**: Minimal bundle size impact
- 🛠️ **Easy Integration**: Simple to integrate into existing Vue 3 projects

## Installation

```bash
npm install radfile
# or
yarn add radfile
# or
pnpm add radfile
```

## Getting Started

1. Import the components:

```vue
import { UploadRoot, UploadFiles, UploadFileButton, UploadDropZone, UploadItem,
UploadItemName, UploadItemSize, UploadItemProgress, UploadItemRemove,
UploadEmptyState } from 'radfile'
```

2. Configure upload options:

```typescript
const options: UploadOptions<{}> = {
  autoUpload: true,
  getMetadata: () => ({}),
  onPickError: (e) => {
    console.error("Error selecting file:", e);
  },
  onUploadError: () => {},
  onSuccess: () => {},
  createUploadHandler: yourUploadHandler,
  restrictions: {
    allowMultiple: false,
    allowedFileTypes: [
      {
        description: "Images",
        accept: {
          "image/*": [".jpeg", ".png", ".jpg"],
        },
      },
    ],
  },
};
```

3. Use components in your template:

````vue
<template>
  <UploadRoot v-slot="{ hasFiles }" :options="options">
  <UploadDropZone>
    <UploadEmptyState />
    <UploadFileButton />
    <UploadFiles v-slot="{ files }">
      <UploadItem
        v-for="file in files"
        v-slot="{ status }"
        :key="file.id"
        :item="file"
      >
        <UploadItemPreview v-slot="{ preview }"></UploadItemPreview>
          <UploadItemProgress v-slot="{ progress }" />
          <UploadItemName />
          <UploadItemErrorMessage />
          <UploadItemSize />
          <UploadItemRemove />
        </UploadItemPreview>
      </UploadItem>
    </UploadFiles>

    <UploadStartUploadButton v-if="hasFiles" />
  </UploadDropZone>
</UploadRoot>
</template>
```

## Development

1. Clone the repository: ```bash git clone
https://github.com/almarzn/radfile.git cd radfile
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Run tests:

```bash
pnpm test
```

## License

MIT License © 2024 [almarzn](https://github.com/almarzn)
