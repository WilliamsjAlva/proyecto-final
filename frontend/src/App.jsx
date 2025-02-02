import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx"; // Importa la nueva página de Login
import "./App.css";
import "./styles/text.css";
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Otras rutas pueden agregarse aquí */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
