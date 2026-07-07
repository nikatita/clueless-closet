import { Trash2, Tag } from 'lucide-react'
import { useDeleteItem } from '../../hooks/useItems'

// Color swatch lookup — maps color name → Tailwind bg class
const COLOR_MAP = {
  white: 'bg-gray-100 border border-gray-200',
  black: 'bg-gray-900',
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  pink: 'bg-pink-400',
  purple: 'bg-purple-500',
  brown: 'bg-amber-800',
  beige: 'bg-amber-100',
  grey: 'bg-gray-400',
  gray: 'bg-gray-400',
  navy: 'bg-blue-900',
}

function ColorDot({ color }) {
  const colorClass = COLOR_MAP[color?.toLowerCase()] || 'bg-gray-200'
  return (
    <span className={`inline-block w-3 h-3 rounded-full ${colorClass}`} />
  )
}

export default function ClothingCard({ item, onClick }) {
  const deleteItem = useDeleteItem()

  function handleDelete(e) {
    // Stop click from also triggering the card's onClick
    e.stopPropagation()
    if (window.confirm(`Remove "${item.name}" from your wardrobe?`)) {
      deleteItem.mutate(item.id)
    }
  }

  return (
    <div
      onClick={() => onClick?.(item)}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
    >
      {/* Image */}
      <div className="aspect-[3/4] bg-cream overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          // Placeholder when no image is uploaded
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
        )}
      </div>

      {/* CV processing badge */}
      {!item.cvProcessed && item.imageUrl && (
        <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-medium">
          Tagging…
        </div>
      )}

      {/* Delete button — only visible on hover */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white/90 hover:bg-red-50 text-gray-500 hover:text-red-500 p-1.5 rounded-full shadow transition-all"
      >
        <Trash2 size={14} />
      </button>

      {/* Card footer */}
      <div className="p-3">
        <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
        <div className="flex items-center gap-2 mt-1">
          {item.color && <ColorDot color={item.color} />}
          <span className="text-xs text-gray-400 capitalize">
            {item.brand || item.category?.toLowerCase()}
          </span>
        </div>

        {/* Tags */}
        {item.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="text-xs bg-blush-50 text-blush-600 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 2 && (
              <span className="text-xs text-gray-400">+{item.tags.length - 2}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
