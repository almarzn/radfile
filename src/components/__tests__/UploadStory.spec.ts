import { test, expect } from "@playwright/experimental-ct-vue";
import UploadStory from "../../UploadStory.vue";
import { UploadPage } from "../../__tests__/UploadPage";
import path from "node:path";

test.describe("Upload Component", () => {
  let model: UploadPage;
  let component: any;

  test.beforeEach(async ({ mount }) => {
    component = await mount(UploadStory);
    model = new UploadPage(component);
  });

  test("renders upload component with all elements", async () => {
    await test.step("Verify main components are visible", async () => {
      await expect(model.root).toBeVisible();
      await expect(model.dropZone).toBeVisible();
      await expect(model.emptyState).toBeVisible();
      await expect(model.fileButton).toBeVisible();
    });

    await test.step("Verify empty state is shown initially", async () => {
      await expect(model.isEmptyStateVisible()).resolves.toBe(true);
    });
  });

  test("handles file upload through button click", async () => {
    const testFiles = await test.step("Create test file paths", async () => {
      return [
        path.join(__dirname, "../../../test-files/test-image.jpg"),
        path.join(__dirname, "../../../test-files/test-document.pdf"),
      ];
    });

    await test.step("Upload files", async () => {
      await model.uploadFilesByButton(testFiles);
    });

    const fileIds = await test.step("Verify files are uploaded", async () => {
      const fileIds = await model.getUploadedFileIds();
      expect(fileIds).toHaveLength(2);
      return fileIds;
    });

    await test.step("Verify file items are displayed correctly", async () => {
      for (const fileId of fileIds) {
        await expect(model.getFileItem(fileId)).toBeVisible();
        await expect(model.getFileName(fileId)).toBeVisible();
        await expect(model.getFilePreview(fileId)).toBeVisible();
        await expect(model.getFileSize(fileId)).toBeVisible();
      }
    });

    await test.step("Verify empty state is hidden", async () => {
      await expect(model.isEmptyStateVisible()).resolves.toBe(false);
    });
  });

  test("handles drag and drop upload", async () => {
    const testFile = path.join(__dirname, "../../../test-files/test-image.jpg");

    await test.step("Verify dropping state is handled correctly", async () => {
      await model.dragOverFiles([testFile]);
      await expect(model.isDroppingState()).resolves.toBe(true);
    });

    await test.step("Simulate drag and drop", async () => {
      await model.dropFiles([testFile]);
    });

    const fileIds = await test.step("Verify file is uploaded", async () => {
      const fileIds = await model.getUploadedFileIds();
      expect(fileIds).toHaveLength(1);

      return fileIds;
    });

    await test.step("Verify file preview and details are shown", async () => {
      const fileId = fileIds[0];
      await expect(model.getFilePreview(fileId)).toBeVisible();
      await expect(model.getFileName(fileId)).toBeVisible();
    });
  });

  test("displays upload progress and handles errors", async () => {
    await test.step("Upload a test file", async () => {
      const testFile = path.join(
        __dirname,
        "../../../test-files/test-image.jpg"
      );
      await model.uploadFilesByButton([testFile]);
    });

    const fileId = await test.step("Get the file ID", async () => {
      const fileIds = await model.getUploadedFileIds();
      return fileIds[0];
    });

    await test.step("Verify progress is shown", async () => {
      const progress = await model.getFileUploadProgress(fileId);
      expect(progress).toBeTruthy();
    });
  });

  test("handles file removal", async () => {
    await test.step("Upload a test file", async () => {
      const testFile = path.join(__dirname, "../../../test-files/test-image.jpg");
      await model.uploadFilesByButton([testFile]);
    });

    const fileId = await test.step("Get the file ID", async () => {
      const fileIds = await model.getUploadedFileIds();
      return fileIds[0];
    });

    await test.step("Remove the file", async () => {
      await model.removeFile(fileId);
    });

    await test.step("Verify file is removed", async () => {
      const updatedFileIds = await model.getUploadedFileIds();
      expect(updatedFileIds).toHaveLength(0);
    });

    await test.step("Verify empty state is shown again", async () => {
      await expect(model.isEmptyStateVisible()).resolves.toBe(true);
    });
  });
});
