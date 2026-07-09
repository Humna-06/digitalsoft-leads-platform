import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Sidebar() {
  const {
    user,
    logout
  } = useAuth();
  const linkClasses = ({
    isActive
  }) => `block px-4 py-2.5 rounded-lg text-sm font-medium transition ${isActive ? "bg-brand-600 text-white" : "text-gray-600 hover:bg-gray-100"}`;
  return <aside className="w-56 bg-white border-r border-gray-200 min-h-screen p-4 flex flex-col">
      <div className="mb-8 px-2">
        <p className="text-lg font-bold text-brand-700">DigitalSoft</p>
        <p className="text-xs text-gray-400">Admin Dashboard</p>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        <NavLink to="/admin/dashboard" className={linkClasses} end>
          Leads
        </NavLink>
        <NavLink to="/admin/appointments" className={linkClasses}>
          Appointments
        </NavLink>
      </nav>

      <div className="border-t border-gray-100 pt-4 px-2">
        <p className="text-xs text-gray-500 mb-2">
          Logged in as <span className="font-medium">{user?.name}</span> ({user?.role})
        </p>
        <button onClick={logout} className="text-sm text-red-600 hover:text-red-700 font-medium">
          Log out
        </button>
      </div>
    </aside>;
}
