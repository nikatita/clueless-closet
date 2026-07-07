import { useState } from 'react'
import { Search } from 'lucide-react'
import { useItems } from '../hooks/useItems'
import ClothingCard from '../components/wardrobe/ClothingCard'
import CategoryFilter from '../components/wardrobe/CategoryFilter'

// This is the main page — the Pinterest-style wardrobe grid.
// Props:
//   onAddClick — opens the AddItemModal (wired in App.jsx)

export default function WardrobePage({ onAddClick }) {
  const [category, setCategory] = useState(null)
  const [search, setSearch] = useState('')

  // Build filter params to pass to the API
  const filters = {}
  if (category) filters.category = category
  if (search.trim()) filters.search = search.trim()

  const { data: items, isLoading, isError } = useItems(filters)

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">My Wardrobe</h1>
        <p className="text-sm text-gray-500">
          {items?.length ?? 0} item{items?.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or brand…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-2xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blush-200"
        />
      </div>

      {/* Category filters */}
      <div className="mb-6">
        <CategoryFilter selected={category} onChange={setCategory} />
      </div>

      {/* Grid */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            // Skeleton cards while loading
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
              <div className="aspect-[3/4] bg-gray-100" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-2 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-1">Couldn't connect to the backend</p>
          <p className="text-sm">Make sure Spring Boot is running on port 8080</p>
        </div>
      )}

      {!isLoading && !isError && items?.length === 0 && (
        <div className="text-center py-24 text-gray-400">
          <p className="text-5xl mb-4">👗</p>
          <p className="text-lg font-medium mb-1">Your wardrobe is empty</p>
          <p className="text-sm mb-6">Add your first item to get started</p>
          <button
            onClick={onAddClick}
            className="bg-blush-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-blush-600/90 transition-colors"
          >
            Add First Item
          </button>
        </div>
      )}

      {!isLoading && !isError && items?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map(item => (
            <ClothingCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
