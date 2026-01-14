"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface QRScannerProps {
  onScan: (qrCode: string) => void
  eventId: string
}

export default function QRScanner({ onScan, eventId }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scanningRef = useRef(false)

  useEffect(() => {
    if (!cameraEnabled) return

    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
          startScanning()
        }
      } catch (err) {
        setError("Unable to access camera. Please check permissions.")
      }
    }

    initCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [cameraEnabled])

  const startScanning = () => {
    scanningRef.current = true
    const scanQRCode = () => {
      if (!scanningRef.current || !videoRef.current || !canvasRef.current) return

      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        // Simple QR detection by looking for patterns
        // In production, use a proper library like jsQR
        const qrPattern = detectQRPattern(data)
        if (qrPattern) {
          onScan(qrPattern)
        }
      }

      requestAnimationFrame(scanQRCode)
    }

    scanQRCode()
  }

  const detectQRPattern = (data: Uint8ClampedArray): string | null => {
    // Placeholder for QR detection
    // In production, implement proper QR code detection or use jsQR library
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code Scanner</CardTitle>
        <CardDescription>Point your camera at a QR code to check in attendees</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!cameraEnabled ? (
          <div className="flex flex-col items-center justify-center py-12 bg-muted rounded-lg">
            <p className="text-muted-foreground mb-4">Camera is not active</p>
            <Button onClick={() => setCameraEnabled(true)}>Enable Camera</Button>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 bg-destructive/10 rounded-lg">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => setCameraEnabled(false)}>Disable Camera</Button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full rounded-lg bg-black"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
            <canvas ref={canvasRef} className="hidden" />
            <Button variant="outline" className="w-full bg-transparent" onClick={() => setCameraEnabled(false)}>
              Stop Camera
            </Button>
          </>
        )}

        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Tip:</strong> For production use, integrate jsQR library for reliable QR code detection.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
