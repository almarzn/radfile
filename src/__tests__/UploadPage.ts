import type { Locator } from "@playwright/test";

export class UploadPage {
  readonly root: Locator;
  readonly dropZone: Locator;
  readonly emptyState: Locator;
  readonly fileButton: Locator;
  readonly filesContainer: Locator;

  constructor(private component: Locator) {
    this.root = component;
    this.dropZone = component.getByTestId("upload-dropzone");
    this.emptyState = component.getByTestId("upload-empty-state");
    this.fileButton = component.getByTestId("upload-file-button");
    this.filesContainer = component.getByTestId("upload-files");
  }

  // File item getters
  getFileItem(fileId: string) {
    return this.filesContainer.getByTestId(`upload-item-id-${fileId}`);
  }

  getFilePreview(fileId: string) {
    return this.getFileItem(fileId).getByTestId("upload-item-preview");
  }

  getFileName(fileId: string) {
    return this.getFileItem(fileId).getByTestId("upload-item-name");
  }

  getFileProgress(fileId: string) {
    return this.getFileItem(fileId).getByTestId("upload-item-progress");
  }

  getFileError(fileId: string) {
    return this.getFileItem(fileId).getByTestId("upload-item-error");
  }

  getFileSize(fileId: string) {
    return this.getFileItem(fileId).getByTestId("upload-item-size");
  }

  getFileRemoveButton(fileId: string) {
    return this.getFileItem(fileId).getByTestId("upload-item-remove");
  }

  // Actions
  async uploadFilesByButton(files: string[]) {
    const fileChooserPromise = this.component
      .page()
      .waitForEvent("filechooser");
    await this.fileButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(files);
  }

  async dropFiles(files: string[]) {
    const dataTransfer = await this.createDataTransfer(files);

    await this.dropZone.dispatchEvent("drop", { dataTransfer });
  }

  async dragOverFiles(files: string[]) {
    const dataTransfer = await this.createDataTransfer(files);

    await this.dropZone.dispatchEvent("dragenter", { dataTransfer });
  }

  private async createDataTransfer(files: string[]) {
    const dataTransfer = await this.component.page().evaluateHandle(() => {
      return new DataTransfer();
    });

    await dataTransfer.evaluate(async (dt, files) => {
      const typesByExtension: Record<string, string> = {
        pdf: "application/pdf",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
      };

      for (const filePath of files) {
        const response = await fetch(filePath);
        const blob = await response.blob();

        const file = new File([blob], filePath.split("/").pop()!, {
          type: typesByExtension[filePath.split(".").pop()!],
        });

        dt.items.add(file);
      }
    }, files);
    return dataTransfer;
  }

  async removeFile(fileId: string) {
    await this.getFileRemoveButton(fileId).click();
  }

  // State checks
  async isEmptyStateVisible() {
    return await this.emptyState.isVisible();
  }

  async getUploadedFileIds(): Promise<string[]> {
    const items = await this.filesContainer
      .locator('[data-testid^="upload-item-id-"]')
      .all();
    return Promise.all(
      items.map(async (item) => {
        const testId = await item.getAttribute("data-testid");
        return testId!.replace("upload-item-id-", "");
      })
    );
  }

  async getFileUploadProgress(fileId: string): Promise<string> {
    return (await this.getFileProgress(fileId).textContent()) || "";
  }

  async getFileErrorMessage(fileId: string): Promise<string> {
    return (await this.getFileError(fileId).textContent()) || "";
  }

  async isDroppingState(): Promise<boolean> {
    const hasAttribute = await this.dropZone.getAttribute("data-dropping");
    return hasAttribute !== null;
  }
}
