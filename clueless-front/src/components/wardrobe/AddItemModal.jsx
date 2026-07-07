import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, Upload, Loader2 } from 'lucide-react'
import { useCreateItem } from '../../hooks/useItems'

const CATEGORIES = ['TOP', 'BOTTOM', 'DRESS', 'OUTERWEAR', 'SHOES', 'ACCESSORY', 'BAG']

// A simple reusable text input
function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blush-200"
        {...props}
      />
    </div>
  )
}

export default function AddItemModal({ onClose }) {
  const createItem = useCreateItem()

  // Form state
  const [name, setName] = useState('')
  const [category, setCategory] = useState('TOP')
  const [color, setColor] = useState('')
  const [brand, setBrand] = useState('')
  const [tags, setTags] = useState('')       // comma-separated string in UI
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)

  // Drag-and-drop zone
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))   // local preview before upload
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  })

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Please enter a name for this item.')
      return
    }

    const itemData = {
      name: name.trim(),
      category,
      color: color.trim() || null,
      brand: brand.trim() || null,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    }

    try {
      await createItem.mutateAsync({ itemData, imageFile })
      onClose()
    } catch (err) {
      setError('Something went wrong. Is your backend running?')
    }
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-lg font-semibold">Add to Wardrobe</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">

          {/* Image drop zone */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-blush-400 bg-blush-50' : 'border-gray-200 hover:border-blush-300'}
            `}
          >
            <input {...getInputProps()} />
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="h-40 mx-auto object-contain rounded-xl"
              />
            ) : (
              <div className="text-gray-400 py-6">
                <Upload size={24} className="mx-auto mb-2" />
                <p className="text-sm">Drop a photo here, or click to browse</p>
              </div>
            )}
          </div>

          {/* Form fields */}
          <Field
            label="Name *"
            placeholder="White linen blazer"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          {/* Category select */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blush-200 bg-white"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Color" placeholder="Yellow" value={color} onChange={e => setColor(e.target.value)} />
            <Field label="Brand" placeholder="Zara" value={brand} onChange={e => setBrand(e.target.value)} />
          </div>

          <Field
            label="Tags (comma-separated)"
            placeholder="casual, summer, floral"
            value={tags}
            onChange={e => setTags(e.target.value)}
          />

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={createItem.isPending}
            className="w-full bg-blush-600 hover:bg-blush-600/90 disabled:opacity-60 text-white font-medium py-3 rounded-2xl transition-colors flex items-center justify-center gap-2"
          >
            {createItem.isPending ? (
              <><Loader2 size={16} className="animate-spin" /> Saving…</>
            ) : (
              'Add to Wardrobe'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
