import { type ChangeEvent, useCallback, useState } from 'react'

import { CodeSyntaxHighlighter } from '@/examples/shared'
import {
  DemoContainer,
  DemoSection,
  ExampleTitle,
  StatusIndicator,
} from '@/examples/shared/TutorialComponents.styles'

interface FileUploadProgress {
  fileName: string
  progress: number
  status: 'uploading' | 'completed' | 'error'
  error?: string
}

interface ProcessedImage {
  name: string
  originalSize: number
  compressedSize: number
  compressionRatio: number
  dataUrl: string
}

export function FileOperationsDemo() {
  const [uploadProgress, setUploadProgress] = useState<FileUploadProgress[]>([])
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Simulate file upload with progress tracking
  const simulateFileUpload = useCallback(async (file: File): Promise<void> => {
    const fileName = file.name

    // Initialize progress tracking
    setUploadProgress((prev) => [
      ...prev,
      { fileName, progress: 0, status: 'uploading' },
    ])

    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100))

        setUploadProgress((prev) =>
          prev.map((item) =>
            item.fileName === fileName ? { ...item, progress } : item
          )
        )
      }

      // Simulate random upload failures
      if (Math.random() > 0.8) {
        throw new Error('Upload failed due to network error')
      }

      // Complete upload
      setUploadProgress((prev) =>
        prev.map((item) =>
          item.fileName === fileName
            ? { ...item, status: 'completed' as const }
            : item
        )
      )
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      setUploadProgress((prev) =>
        prev.map((item) =>
          item.fileName === fileName
            ? { ...item, status: 'error' as const, error: errorMessage }
            : item
        )
      )
    }
  }, [])

  // Handle file selection and upload
  const handleFileUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (!files) return

      // Reset progress
      setUploadProgress([])

      // Upload all files concurrently
      const uploadPromises = Array.from(files).map((file) =>
        simulateFileUpload(file)
      )
      await Promise.allSettled(uploadPromises)
    },
    [simulateFileUpload]
  )

  // Image processing with compression
  const processImages = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (!files) return

      setIsProcessing(true)
      setProcessedImages([])

      try {
        const imageFiles = Array.from(files).filter((file) =>
          file.type.startsWith('image/')
        )

        const processedResults = await Promise.all(
          imageFiles.map(async (file) => {
            // Create canvas for image processing
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const img = new Image()

            return new Promise<ProcessedImage>((resolve, reject) => {
              img.onload = () => {
                // Set canvas dimensions (compress to max 800px width)
                const maxWidth = 800
                const scaleFactor = Math.min(1, maxWidth / img.width)

                canvas.width = img.width * scaleFactor
                canvas.height = img.height * scaleFactor

                // Draw and compress
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)

                // Convert to compressed blob
                canvas.toBlob(
                  (compressedBlob) => {
                    if (compressedBlob) {
                      const compressionRatio =
                        ((file.size - compressedBlob.size) / file.size) * 100

                      resolve({
                        name: file.name,
                        originalSize: file.size,
                        compressedSize: compressedBlob.size,
                        compressionRatio: Math.round(compressionRatio),
                        dataUrl: canvas.toDataURL('image/jpeg', 0.8),
                      })
                    } else {
                      reject(new Error('Failed to compress image'))
                    }
                  },
                  'image/jpeg',
                  0.8
                )
              }

              img.onerror = () => reject(new Error('Failed to load image'))
              img.src = URL.createObjectURL(file)
            })
          })
        )

        setProcessedImages(processedResults)
      } catch {
        // Handle processing errors silently in demo
      } finally {
        setIsProcessing(false)
      }
    },
    []
  )

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <DemoContainer>
      <ExampleTitle>8.2 File Operations and Media</ExampleTitle>

      <DemoSection>
        <h4>File Upload with Progress Tracking</h4>
        <p>
          Production applications need robust file upload capabilities with
          progress tracking and error handling:
        </p>

        <CodeSyntaxHighlighter language='typescript' showLanguageLabel>
          {`// File Upload Hook with Progress Tracking
function useFileUpload() {
  const [uploads, setUploads] = useState<UploadProgress[]>([])
  
  const uploadFile = useCallback(async (
    file: File, 
    endpoint: string
  ): Promise<void> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const xhr = new XMLHttpRequest()
    
    // Track upload progress
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100)
        setUploads(prev => 
          prev.map(upload => 
            upload.fileName === file.name 
              ? { ...upload, progress }
              : upload
          )
        )
      }
    })
    
    // Handle completion
    xhr.addEventListener('load', () => {
      setUploads(prev =>
        prev.map(upload =>
          upload.fileName === file.name
            ? { ...upload, status: 'completed' }
            : upload
        )
      )
    })
    
    // Handle errors
    xhr.addEventListener('error', () => {
      setUploads(prev =>
        prev.map(upload =>
          upload.fileName === file.name
            ? { ...upload, status: 'error', error: 'Upload failed' }
            : upload
        )
      )
    })
    
    xhr.open('POST', endpoint)
    xhr.send(formData)
  }, [])
  
  return { uploads, uploadFile }
}`}
        </CodeSyntaxHighlighter>

        <div style={{ marginTop: '1rem' }}>
          <input
            type='file'
            multiple
            onChange={handleFileUpload}
            style={{
              padding: '0.5rem',
              border: '2px dashed #3b82f6',
              borderRadius: '8px',
              backgroundColor: '#f8fafc',
              width: '100%',
              marginBottom: '1rem',
            }}
          />

          {uploadProgress.length > 0 && (
            <div>
              <h5>Upload Progress:</h5>
              {uploadProgress.map((upload, index) => (
                <div key={index} style={{ marginBottom: '1rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <span>{upload.fileName}</span>
                    <span>{upload.progress}%</span>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${upload.progress}%`,
                        height: '100%',
                        backgroundColor:
                          upload.status === 'error'
                            ? '#ef4444'
                            : upload.status === 'completed'
                              ? '#10b981'
                              : '#3b82f6',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>

                  {upload.status === 'error' && (
                    <StatusIndicator status='rejected'>
                      {upload.error}
                    </StatusIndicator>
                  )}

                  {upload.status === 'completed' && (
                    <StatusIndicator status='fulfilled'>
                      Upload completed successfully
                    </StatusIndicator>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DemoSection>

      <DemoSection>
        <h4>Image Processing and Compression</h4>
        <p>
          Handle image processing asynchronously for better user experience:
        </p>

        <CodeSyntaxHighlighter language='typescript'>
          {`// Image Processing Hook
function useImageProcessor() {
  const [isProcessing, setIsProcessing] = useState(false)
  
  const processImage = useCallback(async (
    file: File,
    options: { maxWidth?: number; quality?: number } = {}
  ): Promise<ProcessedImage> => {
    const { maxWidth = 800, quality = 0.8 } = options
    
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // Calculate new dimensions
        const scaleFactor = Math.min(1, maxWidth / img.width)
        canvas.width = img.width * scaleFactor
        canvas.height = img.height * scaleFactor
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({
                originalSize: file.size,
                compressedSize: blob.size,
                compressionRatio: ((file.size - blob.size) / file.size) * 100,
                dataUrl: canvas.toDataURL('image/jpeg', quality),
              })
            } else {
              reject(new Error('Compression failed'))
            }
          },
          'image/jpeg',
          quality
        )
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }, [])
  
  return { processImage, isProcessing }
}`}
        </CodeSyntaxHighlighter>

        <div style={{ marginTop: '1rem' }}>
          <input
            type='file'
            multiple
            accept='image/*'
            onChange={processImages}
            disabled={isProcessing}
            style={{
              padding: '0.5rem',
              border: '2px dashed #10b981',
              borderRadius: '8px',
              backgroundColor: '#f0fdf4',
              width: '100%',
              marginBottom: '1rem',
            }}
          />

          {isProcessing && (
            <StatusIndicator status='pending'>
              Processing images...
            </StatusIndicator>
          )}

          {processedImages.length > 0 && (
            <div>
              <h5>Processed Images:</h5>
              {processedImages.map((image, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: '2rem',
                    padding: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'flex-start',
                    }}
                  >
                    <img
                      src={image.dataUrl}
                      alt={image.name}
                      style={{
                        maxWidth: '200px',
                        maxHeight: '150px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                      }}
                    />
                    <div>
                      <h6>{image.name}</h6>
                      <p>Original: {formatFileSize(image.originalSize)}</p>
                      <p>Compressed: {formatFileSize(image.compressedSize)}</p>
                      <p>Compression: {image.compressionRatio}% reduction</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DemoSection>

      <DemoSection>
        <h4>Streaming Data Processing</h4>
        <p>
          For large files, use streaming to process data without loading
          everything into memory:
        </p>

        <CodeSyntaxHighlighter language='typescript'>
          {`// Streaming File Reader
class StreamingFileReader {
  async processLargeFile(
    file: File,
    onChunk: (chunk: string, progress: number) => void
  ): Promise<void> {
    const chunkSize = 1024 * 1024 // 1MB chunks
    const totalChunks = Math.ceil(file.size / chunkSize)
    
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize
      const end = Math.min(start + chunkSize, file.size)
      const chunk = file.slice(start, end)
      
      // Read chunk as text
      const text = await this.readChunkAsText(chunk)
      
      // Process chunk
      const progress = ((i + 1) / totalChunks) * 100
      onChunk(text, progress)
      
      // Yield control to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 0))
    }
  }
  
  private readChunkAsText(chunk: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsText(chunk)
    })
  }
}

// Usage with React Hook
function useStreamingFileProcessor() {
  const [progress, setProgress] = useState(0)
  const [chunks, setChunks] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  
  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true)
    setProgress(0)
    setChunks([])
    
    const reader = new StreamingFileReader()
    
    await reader.processLargeFile(file, (chunk, progress) => {
      setChunks(prev => [...prev, chunk])
      setProgress(progress)
    })
    
    setIsProcessing(false)
  }, [])
  
  return { processFile, progress, chunks, isProcessing }
}`}
        </CodeSyntaxHighlighter>
      </DemoSection>
    </DemoContainer>
  )
}

export default FileOperationsDemo
