import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound.jsx";
import Feed from "./pages/Feed.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import OnlyTechnicians from "./pages/OnlyTechnicians.jsx";
import OnlyMods from "./pages/OnlyMods.jsx";
import OnlyAdmins from "./pages/OnlyAdmins.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminUserDetail from "./pages/AdminUserDetail.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import PremiumChatPage from "./pages/PremiumChatPage.jsx";
import ProfileEditor from "./pages/ProfileEditor.jsx";
import PremiumPlans from "./pages/PremiumPlans.jsx";
import VerifiedPayments from "./pages/VerifiedPayments.jsx";
import ScreenshotViewer from "./pages/ScreenshotViewer.jsx";
import SelectPayment from "./pages/SelectPayment.jsx";
import PaymentForm from "./pages/PaymentForm.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import Navbar from "./components/Navbar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import RoleRoute from "./components/RoleRoute.jsx";
import PremiumRoute from "./components/PremiumRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ChatProvider } from "./contexts/ChatContext.jsx";
import Notifications from "./pages/Notifications.jsx";
import "./App.css";
import "./styles/text.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="pt-20">
          <Routes>
            {/* Páginas públicas */}
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Páginas privadas generales */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/feed" element={<PrivateRoute><Feed /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfileEditor /></PrivateRoute>} />
            <Route path="/premiumplans" element={<PrivateRoute><PremiumPlans /></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />

            {/* Páginas de pago */}
            <Route path="/selectpayment" element={<PrivateRoute><SelectPayment /></PrivateRoute>} />
            <Route path="/payment-form" element={<PrivateRoute><PaymentForm /></PrivateRoute>} />
            <Route path="/payment-success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />

            {/* Páginas de posts */}
            <Route path="/post/:id" element={<PrivateRoute><PostDetail /></PrivateRoute>} />
            <Route path="/search/:query" element={<PrivateRoute><SearchResults /></PrivateRoute>} />

            {/* Páginas basadas en roles */}
            <Route path="/onlytechnicians" element={<RoleRoute allowedRoles={["technician"]}><OnlyTechnicians /></RoleRoute>} />
            <Route path="/onlymods" element={<RoleRoute allowedRoles={["moderator"]}><OnlyMods /></RoleRoute>} />
            <Route path="/onlyadmins" element={<RoleRoute allowedRoles={["admin"]}><OnlyAdmins /></RoleRoute>} />
            <Route path="/admin/dashboard" element={<RoleRoute allowedRoles={["admin"]}><AdminDashboard /></RoleRoute>} />
            <Route path="/admin/user/:id" element={<RoleRoute allowedRoles={["admin"]}><AdminUserDetail /></RoleRoute>} />
            <Route path="/admin/verifiedpayments" element={<RoleRoute allowedRoles={["admin"]}><VerifiedPayments /></RoleRoute>} />
            <Route path="/admin/uploads/:imageUrl" element={<ScreenshotViewer />} />

            {/* Chat premium */}
            <Route path="/premium-chat" element={<PrivateRoute><PremiumRoute><ChatProvider><PremiumChatPage /></ChatProvider></PremiumRoute></PrivateRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
