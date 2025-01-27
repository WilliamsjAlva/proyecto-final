import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Register from "./pages/Register.jsx";
import "./App.css";
import "./styles/text.css";

function App() {
  return (
    <Router>
      {/* Navbar siempre visible */}
      <Navbar />

      {/* Rutas configuradas */}
      <Routes>
        <Route path="/" element={<h1 className="text-center mt-10">Inicio</h1>} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
