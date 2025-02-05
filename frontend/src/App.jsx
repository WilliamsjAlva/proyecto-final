// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx"; // Asegúrate de tener una página Home
import Dashboard from "./pages/Dashboard.jsx"; // Página principal para usuarios autenticados
import OnlyTechnicians from "./pages/OnlyTechnicians.jsx";
import OnlyMods from "./pages/OnlyMods.jsx";
import OnlyAdmins from "./pages/OnlyAdmins.jsx";
import Unauthorized from "./pages/Unauthorized.jsx"; // Página para usuarios sin permisos
import PrivateRoute from "./components/PrivateRoute.jsx";
import RoleRoute from "./components/RoleRoute.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import "./App.css";
import "./styles/text.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        {/* Agrega un contenedor con padding-top para evitar que el Navbar fijo tape el contenido */}
        <div className="pt-20">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Rutas privadas generales (usuarios autenticados) */}
            <Route path="/dashboard" element={<PrivateRoute> <Dashboard /> </PrivateRoute>
            }
            />

            {/* Rutas basadas en roles */}
            <Route path="/onlytechnicians" element={<RoleRoute allowedRoles={["technician"]}><OnlyTechnicians /></RoleRoute>} />

            <Route path="/onlymods" element={<RoleRoute allowedRoles={["moderator"]}><OnlyMods /></RoleRoute>} />

            <Route path="/onlyadmins" element={<RoleRoute allowedRoles={["admin"]}><OnlyAdmins /></RoleRoute>} />

            {/* Puedes agregar más rutas según lo necesites */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
