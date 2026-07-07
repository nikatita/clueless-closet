import { Link, useLocation } from 'react-router-dom'
import { Shirt, Sparkles, Plus } from 'lucide-react'

export default function Navbar({ onAddClick }) {
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-blush-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {}
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight">
          <img
          src="/logo.png"
          alt="Clueless Closet"
          className="h-28 w-auto transition-transform duration-300 hover:scale-105"/>
        </Link>

        {}
        <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
          <Link
            to="/"
            className={`hover:text-gray-900 transition-colors ${
              location.pathname === '/' ? 'text-gray-900' : ''
            }`}
          >
            Wardrobe
          </Link>
          <Link
            to="/outfits"
            className={`hover:text-gray-900 transition-colors ${
              location.pathname === '/outfits' ? 'text-gray-900' : ''
            }`}
          >
            Outfits
          </Link>
        </div>

        {/* Add item button */}
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 bg-blush-600 hover:bg-blush-600/90 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>
    </nav>
  )
}
