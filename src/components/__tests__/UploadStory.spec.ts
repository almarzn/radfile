import { test, expect } from '@playwright/experimental-ct-vue'
import UploadStory from '../../UploadStory.vue'
import { UploadPage } from '../../__tests__/UploadPage'
import path from 'node:path'

test.describe('Upload Component', () => {
  let model: UploadPage
  let component: any

  test.beforeEach(async ({ mount }) => {
    component = await mount(UploadStory)
    model = new UploadPage(component)
  })

  test('renders upload component with all elements', async () => {
    
    // Verify main components are visible
    await expect(model.root).toBeVisible()
    await expect(model.dropZone).toBeVisible()
    await expect(model.emptyState).toBeVisible()
    await expect(model.fileButton).toBeVisible()
    
    // Verify empty state is shown initially
    await expect(model.isEmptyStateVisible()).resolves.toBe(true)
  })

  test('handles file upload through button click', async () => {
    
    // Create test file paths
    const testFiles = [
      path.join(__dirname, '../../../test-files/test-image.jpg'),
      path.join(__dirname, '../../../test-files/test-document.pdf')
    ]
    
    // Upload files
    await model.uploadFilesByButton(testFiles)
    
    // Verify files are uploaded
    const fileIds = await model.getUploadedFileIds()
    expect(fileIds).toHaveLength(2)
    
    // Verify file items are displayed correctly
    for (const fileId of fileIds) {
      await expect(model.getFileItem(fileId)).toBeVisible()
      await expect(model.getFileName(fileId)).toBeVisible()
      await expect(model.getFilePreview(fileId)).toBeVisible()
      await expect(model.getFileSize(fileId)).toBeVisible()
    }
    
    // Verify empty state is hidden
    await expect(model.isEmptyStateVisible()).resolves.toBe(false)
  })

  test('handles drag and drop upload', async () => {
    
    // Create test file
    const testFile = path.join(__dirname, '../../../test-files/test-image.jpg')
    
    // Simulate drag and drop
    await model.dropFiles([testFile])
    
    // Verify file is uploaded
    const fileIds = await model.getUploadedFileIds()
    expect(fileIds).toHaveLength(1)
    
    // Verify dropping state is handled correctly
    await expect(model.isDroppingState()).resolves.toBe(true)
    
    // Verify file preview and details are shown
    const fileId = fileIds[0]
    await expect(model.getFilePreview(fileId)).toBeVisible()
    await expect(model.getFileName(fileId)).toBeVisible()
  })

  test('displays upload progress and handles errors', async () => {
    
    // Upload a test file
    const testFile = path.join(__dirname, '../../../test-files/test-image.jpg')
    await model.uploadFilesByButton([testFile])
    
    // Get the file ID
    const fileIds = await model.getUploadedFileIds()
    const fileId = fileIds[0]
    
    // Verify progress is shown
    const progress = await model.getFileUploadProgress(fileId)
    expect(progress).toBeTruthy()
    
    // Verify error handling (if applicable)
    const errorMessage = await model.getFileErrorMessage(fileId)
    if (errorMessage) {
      expect(errorMessage).toContain('Error')
    }
  })

  test('handles file removal', async () => {
    
    // Upload a test file first
    const testFile = path.join(__dirname, '../../../test-files/test-image.jpg')
    await model.uploadFilesByButton([testFile])
    
    // Get the file ID
    const fileIds = await model.getUploadedFileIds()
    const fileId = fileIds[0]
    
    // Remove the file
    await model.removeFile(fileId)
    
    // Verify file is removed
    const updatedFileIds = await model.getUploadedFileIds()
    expect(updatedFileIds).toHaveLength(0)
    
    // Verify empty state is shown again
    await expect(model.isEmptyStateVisible()).resolves.toBe(true)
  })
})
