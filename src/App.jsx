import { useState } from 'react'

export default function App() {
  const [originalImage, setOriginalImage] = useState(null)
  const [compressedImage, setCompressedImage] = useState(null)
  const [quality, setQuality] = useState(80)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setOriginalImage(file)
      setCompressedImage(null)
      setStats(null)
    }
  }

  const compressImage = () => {
    if (!originalImage) return

    setLoading(true)
    const reader = new FileReader()

    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)

        canvas.toBlob(
          (blob) => {
            const compressedSize = blob.size
            const originalSize = originalImage.size
            const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1)

            setCompressedImage({
              blob,
              url: URL.createObjectURL(blob),
              size: compressedSize
            })

            setStats({
              original: (originalSize / 1024).toFixed(2),
              compressed: (compressedSize / 1024).toFixed(2),
              reduction
            })

            setLoading(false)
          },
          'image/jpeg',
          quality / 100
        )
      }
      img.src = event.target.result
    }

    reader.readAsDataURL(originalImage)
  }

  const downloadImage = () => {
    if (!compressedImage) return
    const link = document.createElement('a')
    link.href = compressedImage.url
    link.download = `compressed-${Date.now()}.jpg`
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 rounded-lg shadow-2xl p-6 border border-slate-700">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              🖼️ Image Compressor
            </h1>
            <p className="text-slate-400 text-sm">
              Compress PNG & JPEG up to 80% without losing quality
            </p>
          </div>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-input"
              />
              <label htmlFor="image-input" className="cursor-pointer">
                <p className="text-slate-400 mb-2">📁 Click or drag image</p>
                <p className="text-xs text-slate-500">PNG, JPEG, WebP up to 50MB</p>
              </label>
            </div>

            {originalImage && (
              <div className="bg-slate-700 p-3 rounded">
                <p className="text-sm text-slate-300">
                  📄 {originalImage.name}
                </p>
                <p className="text-xs text-slate-400">
                  {(originalImage.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}

            {originalImage && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Quality: {quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            <button
              onClick={compressImage}
              disabled={!originalImage || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded transition"
            >
              {loading ? '⏳ Compressing...' : '🚀 Compress Image'}
            </button>

            {stats && (
              <div className="bg-slate-700 p-4 rounded border border-slate-600 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Original:</span>
                  <span className="text-white font-medium">{stats.original} KB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Compressed:</span>
                  <span className="text-blue-400 font-medium">{stats.compressed} KB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Reduction:</span>
                  <span className="text-green-400 font-medium">{stats.reduction}%</span>
                </div>
              </div>
            )}

            {compressedImage && (
              <button
                onClick={downloadImage}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition"
              >
                ⬇️ Download Compressed Image
              </button>
            )}
          </div>
        </div>
      </div>

      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7039091592734005"
           crossorigin="anonymous"></script>
    </div>
  )
}
