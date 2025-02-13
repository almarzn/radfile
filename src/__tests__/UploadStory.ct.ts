import { expect, test, type MountResult } from "@playwright/experimental-ct-vue";
import path from "node:path";
import UploadStory from "../UploadStory.vue";
import { UploadPage } from "./UploadPage";

test.describe("Upload Component", () => {
  let model: UploadPage;
  let component: MountResult<typeof UploadStory>;

  test.beforeEach(async ({ mount, page }) => {
    component = await mount(UploadStory);

    await page.evaluate(() => {
      delete window.showOpenFilePicker;
    });
    model = new UploadPage(component);
  });

  test("renders upload component with all elements", async () => {
    // Verify main components are visible
    await expect(model.root).toBeVisible();
    await expect(model.dropZone).toBeVisible();
    await expect(model.emptyState).toBeVisible();
    await expect(model.fileButton).toBeVisible();

    // Verify empty state is shown initially
    await expect(model.isEmptyStateVisible()).resolves.toBe(true);
  });

  test("handles file upload through button click", async () => {
    const testFiles = await test.step("Create test file paths", async () => {
      return [
        path.join(import.meta.dirname, "../../test-files/test-image.jpg"),
        path.join(import.meta.dirname, "../../test-files/test-document.pdf"),
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
    await test.step("Create test file", async () => {
      const testFile = path.join(
        import.meta.dirname,
        "../../test-files/test-image.jpg"
      );

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
  });

  test("displays upload progress", async () => {
    // Upload a test file
    const testFile = path.join(
      import.meta.dirname,
      "../../test-files/test-image.jpg"
    );
    await model.uploadFilesByButton([testFile]);

    // Get the file ID
    const fileIds = await model.getUploadedFileIds();
    const fileId = fileIds[0];

    await model.startUploadButton.click();

    const progress = await model.getFileUploadProgress(fileId);
    await expect(progress).toBe("0%");

    await model.notifyProgress(25_000);

    const updatedProgress = await model.getFileUploadProgress(fileId);
    await expect(updatedProgress).toBe("52%");

    await model.notifyDone();

    const progressDone = await model.getFileProgress(fileId);

    await expect(progressDone).not.toBeVisible();
  });

  test("handles file removal", async () => {
    // Upload a test file first
    const testFile = path.join(
      import.meta.dirname,
      "../../test-files/test-image.jpg"
    );
    await model.uploadFilesByButton([testFile]);

    // Get the file ID
    const fileIds = await model.getUploadedFileIds();
    const fileId = fileIds[0];

    // Remove the file
    await model.removeFile(fileId);

    // Verify file is removed
    const updatedFileIds = await model.getUploadedFileIds();
    expect(updatedFileIds).toHaveLength(0);

    // Verify empty state is shown again
    await expect(model.isEmptyStateVisible()).resolves.toBe(true);
  });
});
