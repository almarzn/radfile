import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { uploadOptionsKey, uploadStateKey, type UploadState } from '../../context'
import UploadFileButton from '../UploadFileButton.vue'

describe('UploadFileButton', () => {
  const originalShowOpenFilePicker = window.showOpenFilePicker

  beforeEach(() => {
    window.showOpenFilePicker = undefined
  })

  afterEach(() => {
    window.showOpenFilePicker = originalShowOpenFilePicker
  })
  const mockOptions = {
    restrictions: {
      allowMultiple: false,
      allowedFileTypes: [
        {
          description: 'PDF files',
          accept: {
            'application/pdf': ['.pdf'],
          },
        },
      ],
    },
    onPickError: vi.fn(),
  }

  const mockState: Partial<UploadState<object>> = {
    files: ref([]),
    addFile: vi.fn(),
    removeFile: vi.fn(),
  }

  const renderButton = (options = mockOptions, state = mockState) => {
    return render(UploadFileButton, {
      global: {
        provide: {
          [uploadOptionsKey as symbol]: options,
          [uploadStateKey as symbol]: state,
        },
      },
    })
  }

  it('renders with default slot content for single file upload', () => {
    renderButton()
    expect(screen.getByText('Select file')).toBeInTheDocument()
  })

  it('renders with default slot content for multiple files - empty state', () => {
    renderButton({
      ...mockOptions,
      restrictions: { ...mockOptions.restrictions, allowMultiple: true },
    })
    expect(screen.getByText('Select files')).toBeInTheDocument()
  })

  it('renders with default slot content for multiple files - with files', () => {
    renderButton(
      {
        ...mockOptions,
        restrictions: { ...mockOptions.restrictions, allowMultiple: true },
      },
      {
        ...mockState,
        files: ref([{ id: '1', file: new File([''], 'test.pdf'), status: { status: 'idle' as const }, metadata: {} }]),
      }
    )
    expect(screen.getByText('Add more files')).toBeInTheDocument()
  })

  it('renders custom slot content', () => {
    render(UploadFileButton, {
      slots: {
        default: 'Custom Button Text',
      },
      global: {
        provide: {
          [uploadOptionsKey as symbol]: mockOptions,
          [uploadStateKey as symbol]: mockState,
        },
      },
    })
    expect(screen.getByText('Custom Button Text')).toBeInTheDocument()
  })

  it('triggers file input when clicked', async () => {
    const user = userEvent.setup()
    renderButton()
    const button = screen.getByRole('button')
    await user.click(button)
    const input = document.querySelector('input')
    expect(input).toHaveAttribute('type', 'file')
  })

  it('sets correct accept attribute based on options', () => {
    renderButton()
    const input = document.querySelector('input')
    expect(input).toHaveAttribute('accept', 'application/pdf,.pdf')
  })

  it('sets multiple attribute when allowMultiple is true', () => {
    renderButton({
      ...mockOptions,
      restrictions: { ...mockOptions.restrictions, allowMultiple: true },
    })
    const input = document.querySelector('input');
    expect(input).toHaveAttribute('multiple')
  })

  it('does not set multiple attribute when allowMultiple is false', () => {
    renderButton()
    const input = document.querySelector('input');
    expect(input).not.toHaveAttribute('multiple')
  })

  it('uses showOpenFilePicker when available', async () => {
    const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    const mockHandle = {
      getFile: () => Promise.resolve(mockFile)
    }
    window.showOpenFilePicker = vi.fn().mockResolvedValue([mockHandle])

    const user = userEvent.setup()
    renderButton()
    
    const button = screen.getByRole('button')
    await user.click(button)

    expect(window.showOpenFilePicker).toHaveBeenCalledWith({
      multiple: false,
      types: [{
        description: 'PDF files',
        accept: {
          'application/pdf': ['.pdf']
        }
      }]
    })
    expect(mockState.addFile).toHaveBeenCalledWith(mockFile)
  })

  it('handles showOpenFilePicker with multiple files', async () => {
    const mockFiles = [
      new File(['test1'], 'test1.pdf', { type: 'application/pdf' }),
      new File(['test2'], 'test2.pdf', { type: 'application/pdf' })
    ]
    const mockHandles = mockFiles.map(file => ({
      getFile: () => Promise.resolve(file)
    }))
    window.showOpenFilePicker = vi.fn().mockResolvedValue(mockHandles)

    const user = userEvent.setup()
    renderButton({
      ...mockOptions,
      restrictions: { ...mockOptions.restrictions, allowMultiple: true }
    })
    
    const button = screen.getByRole('button')
    await user.click(button)

    expect(window.showOpenFilePicker).toHaveBeenCalledWith({
      multiple: true,
      types: [{
        description: 'PDF files',
        accept: {
          'application/pdf': ['.pdf']
        }
      }]
    })
    expect(mockState.addFile).toHaveBeenCalledWith(mockFiles)
  })

  it('calls onPickError when showOpenFilePicker throws', async () => {
    const error = new Error('User cancelled')
    window.showOpenFilePicker = vi.fn().mockRejectedValue(error)

    const user = userEvent.setup()
    renderButton()
    
    const button = screen.getByRole('button')
    await user.click(button)

    expect(mockOptions.onPickError).toHaveBeenCalledWith(error)
  })
})
