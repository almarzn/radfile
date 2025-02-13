import {
  expect,
  test,
  type MountResult,
} from "@playwright/experimental-ct-vue";
import path from "node:path";
import UploadStory from "../UploadStory.vue";
import { UploadPage } from "./UploadPage";

test.describe("Upload Component", () => {
  let model: UploadPage;
  let component: MountResult<typeof UploadStory>;

  test.describe("multiple files", () => {
    test.beforeEach(async ({ mount, page }) => {
      component = await mount(UploadStory, {
        props: {
          allowMultiple: true,
        },
      });

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
      const testFile = await test.step("Prepare test file", async () => {
        return path.join(
          import.meta.dirname,
          "../../test-files/test-image.jpg"
        );
      });

      await test.step("Upload file", async () => {
        await model.uploadFilesByButton([testFile]);
      });

      const fileId = await test.step("Get uploaded file ID", async () => {
        const fileIds = await model.getUploadedFileIds();
        expect(fileIds).toHaveLength(1);
        return fileIds[0];
      });

      await test.step("Start upload", async () => {
        await model.startUploadButton.click();
      });

      await test.step("Check initial progress", async () => {
        const progress = await model.getFileUploadProgress(fileId);
        await expect(progress).toBe("0%");
      });

      await test.step("Update progress", async () => {
        await model.notifyProgress(25_000);
        const updatedProgress = await model.getFileUploadProgress(fileId);
        await expect(updatedProgress).toBe("52%");
      });

      await test.step("Complete upload", async () => {
        await model.notifyDone();
        const progressDone = await model.getFileProgress(fileId);
        await expect(progressDone).not.toBeVisible();
      });
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

  test.describe("single file", () => {
    test.beforeEach(async ({ mount, page }) => {
      component = await mount(UploadStory, {
        props: {
          allowMultiple: false,
        },
      });

      await page.evaluate(() => {
        delete window.showOpenFilePicker;
      });
      model = new UploadPage(component);
    });

    test("Prevent dragging multiple files", async () => {
      const testFiles = await test.step("Create test file paths", async () => {
        return [
          path.join(import.meta.dirname, "../../test-files/test-image.jpg"),
          path.join(import.meta.dirname, "../../test-files/test-document.pdf"),
        ];
      });

      await model.dragOverFiles(testFiles);

      await expect(model.isDroppingState()).resolves.toBe(false);
    });

    test("Adding another file replaces the current file", async () => {
      const testFile1 = await test.step("Create test file path 1", async () => {
        return path.join(
          import.meta.dirname,
          "../../test-files/test-image.jpg"
        );
      });

      await test.step("Upload first file", async () => {
        await model.uploadFilesByButton([testFile1]);

        const fileIds = await model.getUploadedFileIds();
        expect(fileIds).toHaveLength(1);

        const fileId = fileIds[0];
        await expect(model.getFilePreview(fileId)).toBeVisible();
        await expect(model.getFileName(fileId)).toBeVisible();
      });

      const testFile2 = await test.step("Create test file path 2", async () => {
        return path.join(
          import.meta.dirname,
          "../../test-files/test-document.pdf"
        );
      });

      await test.step("Upload second file", async () => {
        await model.uploadFilesByButton([testFile2]); 

        const fileIds = await model.getUploadedFileIds();
        expect(fileIds).toHaveLength(1);  

        const fileId = fileIds[0];
        await expect(model.getFilePreview(fileId)).toBeVisible();
        await expect(model.getFileName(fileId)).toHaveText("test-document.pdf");
      });
    });
  });
});