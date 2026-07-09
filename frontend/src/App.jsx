import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicLeadForm from "./pages/PublicLeadForm";
import BookingPage from "./pages/BookingPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAppointments from "./pages/AdminAppointments";
export default function App() {
  return <Routes>
      {}
      <Route path="/" element={<>
            <Navbar />
            <PublicLeadForm />
          </>} />
      <Route path="/book" element={<>
            <Navbar />
            <BookingPage />
          </>} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {}
      <Route path="/admin/dashboard" element={<ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>} />
      <Route path="/admin/appointments" element={<ProtectedRoute>
            <AdminAppointments />
          </ProtectedRoute>} />
    </Routes>;
}
