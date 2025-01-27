import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="#" className="text-2xl font-bold text-blue-600">MyApp</a>
          <div className="space-x-4">
            <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Features</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Pricing</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Contact</a>
          </div>
        </div>
      </nav>
    </>
  )
}

export default App
