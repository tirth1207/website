"use client"

import React, { useRef, useState, useEffect, useCallback } from "react"

// ASCII character sets for different rendering modes
const ASCII_MODES = {
  classic: "@$B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
  blocks: "██▓▒░ ",
  shades: "██▓▒░  ",
  numbers: "9876543210 ",
  alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ",
  minimal: "█▌ ",
  detailed: "@%#*+=-:. ",
  pixel: "██▀▄ "
} as const

type AsciiMode = keyof typeof ASCII_MODES
type ColorMode = 'none' | 'color' | 'grayscale'
type Theme = 'light' | 'dark' | 'auto'

interface AsciiImageProps {
  src: string
  alt?: string
  width?: number
  height?: number
  mode?: AsciiMode
  colorMode?: ColorMode
  theme?: Theme
  gamma?: number
  dithering?: boolean
  aspectRatio?: number
  fitToContainer?: boolean
  maxWidth?: number
  maxHeight?: number
  className?: string
  style?: React.CSSProperties
  onLoad?: () => void
  onError?: (error: Error) => void
}

export const AsciiImage: React.FC<AsciiImageProps> = ({
  src,
  alt = "ASCII converted image",
  width = 80,
  height,
  mode = 'classic',
  colorMode = 'none',
  theme = 'auto',
  gamma = 1.0,
  dithering = true,
  aspectRatio = 0.5,
  fitToContainer = true,
  maxWidth,
  maxHeight,
  className = '',
  style = {},
  onLoad,
  onError,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const resizeObserverRef = useRef<ResizeObserver>(null)

  const [ascii, setAscii] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [calculatedDimensions, setCalculatedDimensions] = useState({ width: width, height: height || 0 })
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light')

  // Get mode-specific aspect ratio for better character rendering
  const getModeAspectRatio = useCallback((mode: AsciiMode): number => {
    switch (mode) {
      case 'blocks':
        return 0.5 // Block characters
      case 'pixel':
      case 'shades':
        return 0.5 // Standard block aspect ratio
      default:
        return aspectRatio // Use provided aspect ratio for other modes
    }
  }, [aspectRatio])

  const effectiveAspectRatio = getModeAspectRatio(mode)

  // Detect system theme
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      setCurrentTheme(mediaQuery.matches ? 'dark' : 'light')
      
      const handleChange = (e: MediaQueryListEvent) => {
        setCurrentTheme(e.matches ? 'dark' : 'light')
      }
      
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      setCurrentTheme(theme)
    }
  }, [theme])

  // Floyd–Steinberg dithering
  const floydSteinberg = useCallback((grayMap: number[][], width: number, height: number, levels: number) => {
    const copy = grayMap.map(row => [...row])
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const oldPixel = copy[y][x]
        const newPixel = Math.round((levels - 1) * oldPixel) / (levels - 1)
        copy[y][x] = newPixel
        const quantError = oldPixel - newPixel

        if (x + 1 < width) copy[y][x + 1] += quantError * (7 / 16)
        if (y + 1 < height) {
          if (x > 0) copy[y + 1][x - 1] += quantError * (3 / 16)
          copy[y + 1][x] += quantError * (5 / 16)
          if (x + 1 < width) copy[y + 1][x + 1] += quantError * (1 / 16)
        }
      }
    }
    return copy
  }, [])

  // Calculate responsive dimensions
  const calculateResponsiveDimensions = useCallback(() => {
    if (!imageDimensions.width || !imageDimensions.height) {
      return { width: width, height: height || Math.floor(width * 0.75) }
    }

    if (!fitToContainer) {
      // When not fitting to container, use image dimensions to calculate ASCII size
      const imageAspectRatio = imageDimensions.width / imageDimensions.height
      
      if (width && !height) {
        // Only width specified, calculate height from aspect ratio
        const targetHeight = Math.floor(width / (imageAspectRatio * effectiveAspectRatio))
        return { width, height: targetHeight }
      } else if (!width && height) {
        // Only height specified, calculate width from aspect ratio
        const targetWidth = Math.floor(height * imageAspectRatio * effectiveAspectRatio)
        return { width: targetWidth, height }
      } else if (width && height) {
        // Both specified, use as-is
        return { width, height }
      } else {
        // Neither specified, calculate from image size with a reasonable scale
        const scale = Math.min(120 / imageDimensions.width, 80 / imageDimensions.height)
        const targetWidth = Math.floor(imageDimensions.width * scale)
        const targetHeight = Math.floor(imageDimensions.height * scale / effectiveAspectRatio)
        return { width: targetWidth, height: targetHeight }
      }
    }

    // Fit to container logic - simplified and more reliable
    if (!containerSize.width || !containerSize.height) {
      return { width: 100, height: 60 }
    }

    const imageAspectRatio = imageDimensions.width / imageDimensions.height
    
    // Calculate dimensions that will fit in container while maintaining aspect ratio
    // Start with a reasonable base size and scale to container
    let targetCols = Math.min(120, Math.max(40, Math.floor(containerSize.width / 8)))
    let targetRows = Math.floor(targetCols / (imageAspectRatio * effectiveAspectRatio))
    
    // Ensure minimum viable dimensions
    targetCols = Math.max(targetCols, 20)
    targetRows = Math.max(targetRows, 15)

    if (maxWidth) targetCols = Math.min(targetCols, maxWidth)
    if (maxHeight) targetRows = Math.min(targetRows, maxHeight)

    return { width: targetCols, height: targetRows }
  }, [fitToContainer, width, height, imageDimensions, containerSize, effectiveAspectRatio, maxWidth, maxHeight])

  // Container resize observer
  useEffect(() => {
    if (!containerRef.current || !fitToContainer) return

    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect()
    }

    // @ts-expect-error: workaround for readonly ref
    resizeObserverRef.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        // Ensure minimum container size for proper rendering
        if (width > 10 && height > 10) {
          setContainerSize({ width, height })
        }
      }
    })

    resizeObserverRef.current.observe(containerRef.current)

    // Set initial container size
    const rect = containerRef.current.getBoundingClientRect()
    if (rect.width > 10 && rect.height > 10) {
      setContainerSize({ width: rect.width, height: rect.height })
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
    }
  }, [fitToContainer])

  // Update calculated dimensions
  useEffect(() => {
    const newDimensions = calculateResponsiveDimensions()
    setCalculatedDimensions(prev => {
      if (prev.width !== newDimensions.width || prev.height !== newDimensions.height) {
        return newDimensions
      }
      return prev
    })
  }, [calculateResponsiveDimensions])

  // Convert pixels to ASCII with mode-specific optimizations
  const processImageToAscii = useCallback((imageData: ImageData, width: number, height: number) => {
    const { data } = imageData
    const charSet = ASCII_MODES[mode]
    let grayMap: number[][] = []

    // Create grayscale map
    for (let y = 0; y < height; y++) {
      grayMap[y] = []
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4
        const r = data[idx]
        const g = data[idx + 1]
        const b = data[idx + 2]
        let brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255
        
        // Mode-specific gamma adjustments for better visibility
        if (mode === 'blocks') {
          brightness = Math.pow(brightness, gamma * 0.8) // Slightly reduce gamma for block mode
        } else {
          brightness = Math.pow(brightness, gamma)
        }
        grayMap[y][x] = brightness
      }
    }

    // Apply dithering if enabled
    if (dithering) {
      grayMap = floydSteinberg(grayMap, width, height, charSet.length)
    }

    // Generate ASCII output
    let output = ""
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4
        const r = data[idx]
        const g = data[idx + 1]
        const b = data[idx + 2]

        const val = grayMap[y][x]
        
        // Improved character mapping for special modes
        let charIndex: number
        if (mode === 'blocks') {
          // More aggressive mapping for high-contrast modes
          const enhancedVal = Math.pow(val, 0.7) // Enhance contrast
          charIndex = Math.floor((charSet.length - 1) * (1 - enhancedVal))
        } else {
          charIndex = Math.floor((charSet.length - 1) * (1 - val))
        }
        
        const char = charSet[Math.max(0, Math.min(charIndex, charSet.length - 1))] || " "

        if (colorMode === 'color') {
          let escapedChar = char
          if (char === "<") escapedChar = "&lt;"
          else if (char === ">") escapedChar = "&gt;"
          else if (char === "&") escapedChar = "&amp;"
          output += `<span style="color:rgb(${r},${g},${b})">${escapedChar}</span>`
        } else if (colorMode === 'grayscale') {
          const gray = Math.floor(0.299 * r + 0.587 * g + 0.114 * b)
          let escapedChar = char
          if (char === "<") escapedChar = "&lt;"
          else if (char === ">") escapedChar = "&gt;"
          else if (char === "&") escapedChar = "&amp;"
          output += `<span style="color:rgb(${gray},${gray},${gray})">${escapedChar}</span>`
        } else {
          output += char
        }
      }
      output += "\n"
    }

    setAscii(output)
  }, [mode, colorMode, gamma, dithering, floydSteinberg])

  // Render ASCII from image
  const renderAscii = useCallback(() => {
    if (!imageRef.current || !canvasRef.current || !imageRef.current.complete) return

    const image = imageRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return

    const w = image.naturalWidth
    const h = image.naturalHeight

    if (w === 0 || h === 0) return

    setImageDimensions(prev => {
      if (prev.width !== w || prev.height !== h) {
        return { width: w, height: h }
      }
      return prev
    })

    const asciiWidth = Math.max(1, calculatedDimensions.width)
    const asciiHeight = Math.max(1, calculatedDimensions.height)

    if (asciiWidth === 0 || asciiHeight === 0) return

    canvas.width = asciiWidth
    canvas.height = asciiHeight

    try {
      ctx.drawImage(image, 0, 0, asciiWidth, asciiHeight)
      const imageData = ctx.getImageData(0, 0, asciiWidth, asciiHeight)
      processImageToAscii(imageData, asciiWidth, asciiHeight)
    } catch (err) {
      // Handle CORS/tainted canvas by trying without crossOrigin
      if (err instanceof Error && err.name === 'SecurityError') {
        console.warn('CORS issue detected, trying to reload image without crossOrigin...')
        
        // Create a new image without crossOrigin
        const fallbackImg = new Image()
        fallbackImg.onload = () => {
          try {
            const fallbackCanvas = document.createElement('canvas')
            const fallbackCtx = fallbackCanvas.getContext('2d', { willReadFrequently: true })
            if (!fallbackCtx) return
            
            fallbackCanvas.width = asciiWidth
            fallbackCanvas.height = asciiHeight
            fallbackCtx.drawImage(fallbackImg, 0, 0, asciiWidth, asciiHeight)
            
            const fallbackImageData = fallbackCtx.getImageData(0, 0, asciiWidth, asciiHeight)
            processImageToAscii(fallbackImageData, asciiWidth, asciiHeight)
          } catch (fallbackErr) {
            const error = new Error(`Failed to process image after fallback: ${fallbackErr}`)
            setError(error.message)
            onError?.(error)
          }
        }
        fallbackImg.onerror = () => {
          const error = new Error('Failed to load image without CORS')
          setError(error.message)
          onError?.(error)
        }
        fallbackImg.src = src
      } else {
        const error = new Error(`Failed to process image: ${err}`)
        setError(error.message)
        onError?.(error)
      }
    }
  }, [calculatedDimensions, processImageToAscii, onError, src])

  // Handle image load/error
  useEffect(() => {
    if (!imageRef.current) return

    const image = imageRef.current

    const handleLoad = () => {
      setIsLoading(false)
      setError(null)
      
      // Set image dimensions first
      const w = image.naturalWidth
      const h = image.naturalHeight
      if (w > 0 && h > 0) {
        setImageDimensions({ width: w, height: h })
        
        // Set container size for non-fitting containers
        if (!fitToContainer) {
          setContainerSize({ width: w, height: h })
        }
      }

      // Delay rendering to ensure dimensions are set
      setTimeout(renderAscii, 100)
      onLoad?.()
    }

    const handleError = () => {
      setIsLoading(false)
      const error = new Error(`Failed to load image: ${src}`)
      setError(error.message)
      onError?.(error)
    }

    image.addEventListener('load', handleLoad)
    image.addEventListener('error', handleError)

    if (image.complete && image.naturalWidth > 0) {
      handleLoad()
    }

    return () => {
      image.removeEventListener('load', handleLoad)
      image.removeEventListener('error', handleError)
    }
  }, [src, renderAscii, fitToContainer, onLoad, onError])

  // Recalculate on dependency changes
  useEffect(() => {
    if (!isLoading && !error && imageRef.current?.complete) {
      renderAscii()
    }
  }, [mode, colorMode, gamma, dithering, calculatedDimensions, renderAscii, isLoading, error])

  // Calculate styles for proper rendering
  const getStyles = () => {
    let fontSize = 8 // Default font size
    let lineHeight = "1.0"
    let letterSpacing = "0px"

    if (fitToContainer && containerSize.width > 0 && containerSize.height > 0 && calculatedDimensions.width > 0 && calculatedDimensions.height > 0) {
      // Calculate font size to fit container
      const charWidth = 0.6 // Approximate character width in em
      const cols = calculatedDimensions.width
      const rows = calculatedDimensions.height
      
      // Calculate font size that fits both width and height
      const fontSizeFromWidth = containerSize.width / (cols * charWidth)
      const fontSizeFromHeight = containerSize.height / rows
      
      fontSize = Math.max(4, Math.min(fontSizeFromWidth, fontSizeFromHeight))
      
      // Adjust line height for better fitting
      lineHeight = mode === 'blocks' ? "0.9" : "1.0"
      
      // Calculate letter spacing to fill width exactly
      const actualCharWidth = fontSize * charWidth
      const totalUsedWidth = actualCharWidth * cols
      const leftoverWidth = containerSize.width - totalUsedWidth
      if (leftoverWidth > 0 && cols > 1) {
        letterSpacing = `${leftoverWidth / (cols - 1)}px`
      }
    }

    const baseStyle = {
      fontFamily: "'Courier New', Consolas, 'Lucida Console', Monaco, monospace",
      fontSize: `${fontSize}px`,
      lineHeight: lineHeight,
      letterSpacing: letterSpacing,
      whiteSpace: "pre" as const,
      margin: 0,
      padding: 0,
      width: fitToContainer ? "100%" : "auto",
      height: fitToContainer ? "100%" : "auto",
      overflow: "hidden" as const,
      display: "block" as const,
      boxSizing: "border-box" as const,
    }

    if (colorMode !== 'none') {
      return baseStyle
    }

    return {
      ...baseStyle,
      color: currentTheme === 'dark' ? '#ffffff' : '#000000',
      backgroundColor: 'transparent',
    }
  }

  if (error) {
    return (
      <div className={className} style={style}>
        <div style={{ 
          color: currentTheme === 'dark' ? '#ff6b6b' : '#dc3545', 
          fontFamily: 'monospace',
          padding: '1rem',
          textAlign: 'center'
        }}>
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: fitToContainer ? "100%" : "auto",
        height: fitToContainer ? "100%" : "auto",
        display: "block",
        overflow: fitToContainer ? "hidden" : "visible",
        backgroundColor: currentTheme === 'dark' ? '#1a1a1a' : '#ffffff',
        border: `1px solid ${currentTheme === 'dark' ? '#333' : '#ccc'}`,
        minWidth: fitToContainer ? "200px" : "auto",
        minHeight: fitToContainer ? "150px" : "auto",
        ...style
      }}
    >
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        style={{ display: "none" }}
        crossOrigin="anonymous"
      />
      
      {isLoading ? (
        <div style={{ 
          color: currentTheme === 'dark' ? '#ffffff' : '#000000',
          fontFamily: 'monospace',
          padding: '1rem',
          textAlign: 'center'
        }}>
          Loading...
        </div>
      ) : ascii ? (
        colorMode !== 'none' ? (
          <pre
            style={getStyles()}
            dangerouslySetInnerHTML={{ __html: ascii }}
          />
        ) : (
          <pre style={getStyles()}>
            {ascii}
          </pre>
        )
      ) : (
        <div style={{ 
          color: currentTheme === 'dark' ? '#888' : '#666',
          fontFamily: 'monospace',
          padding: '1rem',
          textAlign: 'center'
        }}>
          No ASCII generated
        </div>
      )}
    </div>
  )
}
