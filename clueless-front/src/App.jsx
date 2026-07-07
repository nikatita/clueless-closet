import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import WardrobePage from './pages/WardrobePage'
import OutfitsPage from './pages/OutfitsPage'
import AddItemModal from './components/wardrobe/AddItemModal'

// App.jsx is the root of the React tree.
// It owns the modal's open/closed state so the Navbar button
// and the empty-state button on the wardrobe page both work.

export default function App() {
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div className="min-h-screen bg-cream font-sans">
      <Navbar onAddClick={() => setShowAddModal(true)} />

      <Routes>
        <Route
          path="/"
          element={<WardrobePage onAddClick={() => setShowAddModal(true)} />}
        />
        <Route path="/outfits" element={<OutfitsPage />} />
      </Routes>

      {/* Modal is mounted at root level so it overlays everything */}
      {showAddModal && (
        <AddItemModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  )
}
