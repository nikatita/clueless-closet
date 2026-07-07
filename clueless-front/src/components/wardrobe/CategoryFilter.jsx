// The pill-shaped filter buttons at the top of the wardrobe grid

const CATEGORIES = [
  { label: 'All', value: null },
  { label: 'Tops', value: 'TOP' },
  { label: 'Bottoms', value: 'BOTTOM' },
  { label: 'Dresses', value: 'DRESS' },
  { label: 'Outerwear', value: 'OUTERWEAR' },
  { label: 'Shoes', value: 'SHOES' },
  { label: 'Accessories', value: 'ACCESSORY' },
  { label: 'Bags', value: 'BAG' },
]

export default function CategoryFilter({ selected, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      {CATEGORIES.map(cat => (
        <button
          key={cat.label}
          onClick={() => onChange(cat.value)}
          className={`
            whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all
            ${selected === cat.value
              ? 'bg-blush-600 text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-blush-50 border border-gray-200'
            }
          `}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
