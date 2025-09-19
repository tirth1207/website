"use client"

import { useRef, useEffect, useState } from "react"

interface StampImageProps {
  src: string
  alt?: string
  size?: number
  className?: string
  onLoad?: () => void
  onError?: () => void
  innerColor?: string // color for the inner part (background)
  outerColor?: string // color for the outer part (border, perforation)
}

export function StampImage({
  src,
  alt = "Stamp image",
  size = 200,
  className = "",
  onLoad,
  onError,
  innerColor = "#ffffff", // default to white
  outerColor = "#c0c0c0", // default to gray
}: StampImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [imgSize, setImgSize] = useState<{ width: number; height: number } | null>(null)
  const [imgError, setImgError] = useState(false)

  // Preload image to get dimensions
  useEffect(() => {
    if (!src) return

    setImgError(false)
    const img = new window.Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      setImgSize({ width: img.width, height: img.height })
      onLoad?.()
    }

    img.onerror = () => {
      setImgError(true)
      onError?.()
    }

    img.src = src
    // eslint-disable-next-line
  }, [src])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // If image failed to load, draw placeholder stamp
    if (imgError || !src) {
      drawPlaceholderStamp(ctx, size, innerColor, outerColor)
      return
    }

    if (!imgSize) return

    // Calculate base image area (preserve aspect ratio, fit to size)
    const aspect = imgSize.width / imgSize.height
    let baseWidth = size
    let baseHeight = size
    if (aspect > 1) {
      baseHeight = size / aspect
    } else if (aspect < 1) {
      baseWidth = size * aspect
    }

    const padding = 20
    const width = baseWidth + padding * 2
    const height = baseHeight + padding * 2
    canvas.width = width
    canvas.height = height

    // Fill background (innerColor)
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = innerColor
    ctx.fillRect(0, 0, width, height)

    // Draw outer border (outerColor) and perforations
    drawPerforatedBorder(ctx, width, height, padding, outerColor)

    // Draw the image inside the stamp
    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      // Clip to rounded rect for inner area
      ctx.save()
      if ("roundRect" in ctx) {
        // @ts-ignore
        ctx.beginPath()
        // @ts-ignore
        ctx.roundRect(padding, padding, baseWidth, baseHeight, 10)
        ctx.clip()
      }
      ctx.drawImage(img, padding, padding, baseWidth, baseHeight)
      ctx.restore()
    }
    img.src = src
  }, [src, size, imgSize, innerColor, outerColor, imgError])

  // Draws the border and perforations
  function drawPerforatedBorder(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    padding: number,
    borderColor: string
  ) {
    const perfSize = 6
    const perfSpacing = 11
    const borderWidth = 9

    // Draw outer border (outerColor)
    ctx.save()
    ctx.strokeStyle = borderColor
    ctx.lineWidth = borderWidth
    ctx.strokeRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth)
    ctx.restore()

    // Perforation dots
    function drawPerfDot(x: number, y: number) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(x, y, perfSize / 2, 0, Math.PI * 2)
      ctx.fillStyle = borderColor
      ctx.shadowColor = borderColor
      ctx.shadowBlur = 0.5
      ctx.fill()
      ctx.restore()
    }

    // Top & Bottom
    for (let x = padding; x <= width - padding; x += perfSpacing) {
      drawPerfDot(x, padding / 2)
      drawPerfDot(x, height - padding / 2)
    }
    // Left & Right
    for (let y = padding; y <= height - padding; y += perfSpacing) {
      drawPerfDot(padding / 2, y)
      drawPerfDot(width - padding / 2, y)
    }
    // Corners
    drawPerfDot(padding / 2, padding / 2)
    drawPerfDot(width - padding / 2, padding / 2)
    drawPerfDot(padding / 2, height - padding / 2)
    drawPerfDot(width - padding / 2, height - padding / 2)
  }

  // Draws a placeholder stamp (no image)
  function drawPlaceholderStamp(
    ctx: CanvasRenderingContext2D,
    size: number,
    innerColor: string,
    outerColor: string
  ) {
    const padding = 20
    const width = size + padding * 2
    const height = size + padding * 2
    ctx.clearRect(0, 0, width, height)
    ctx.canvas.width = width
    ctx.canvas.height = height

    // Fill background (innerColor)
    ctx.fillStyle = innerColor
    ctx.fillRect(0, 0, width, height)

    // Draw outer border (outerColor)
    ctx.save()
    ctx.strokeStyle = outerColor
    ctx.lineWidth = 9
    ctx.strokeRect(4.5, 4.5, width - 9, height - 9)
    ctx.restore()

    // Perforation dots
    function drawPerfDot(x: number, y: number) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = outerColor
      ctx.shadowColor = outerColor
      ctx.shadowBlur = 0.5
      ctx.fill()
      ctx.restore()
    }
    const perfSize = 6
    const perfSpacing = 11
    // Top & Bottom
    for (let x = padding; x <= width - padding; x += perfSpacing) {
      drawPerfDot(x, padding / 2)
      drawPerfDot(x, height - padding / 2)
    }
    // Left & Right
    for (let y = padding; y <= height - padding; y += perfSpacing) {
      drawPerfDot(padding / 2, y)
      drawPerfDot(width - padding / 2, y)
    }
    // Corners
    drawPerfDot(padding / 2, padding / 2)
    drawPerfDot(width - padding / 2, padding / 2)
    drawPerfDot(padding / 2, height - padding / 2)
    drawPerfDot(width - padding / 2, height - padding / 2)

    // Inner area (simulate image)
    ctx.save()
    if ("roundRect" in ctx) {
      // @ts-ignore
      ctx.beginPath()
      // @ts-ignore
      ctx.roundRect(padding, padding, size, size, 10)
      ctx.clip()
    }
    const grad = ctx.createLinearGradient(padding, padding, padding + size, padding + size)
    grad.addColorStop(0, "#f8f8f8")
    grad.addColorStop(1, "#e0e0e0")
    ctx.fillStyle = grad
    ctx.fillRect(padding, padding, size, size)
    ctx.restore()

    // Draw placeholder icon (🖼️)
    ctx.save()
    ctx.font = "bold 64px serif"
    ctx.globalAlpha = 0.7
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "#888"
    ctx.shadowColor = "#fff"
    ctx.shadowBlur = 1
    ctx.fillText("🖼️", width / 2, height / 2 + 8)
    ctx.restore()

    // Subtle shadow below
    ctx.save()
    const shadowGrad = ctx.createRadialGradient(width / 2, height - 8, 8, width / 2, height - 8, 60)
    shadowGrad.addColorStop(0, "rgba(180,180,180,0.18)")
    shadowGrad.addColorStop(1, "rgba(255,255,255,0)")
    ctx.globalAlpha = 1
    ctx.beginPath()
    ctx.ellipse(width / 2, height - 8, 60, 10, 0, 0, Math.PI * 2)
    ctx.fillStyle = shadowGrad
    ctx.filter = "blur(2px)"
    ctx.fill()
    ctx.restore()
  }

  return (
    <canvas
      ref={canvasRef}
      className={`max-w-full h-auto ${className}`}
      style={{
        filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.10))",
        borderRadius: 18,
        background: innerColor,
        display: "block",
      }}
      aria-label={alt}
    />
  )
}
