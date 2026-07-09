import { Link } from "react-router-dom";
export default function Navbar() {
  return <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-brand-700">
          DigitalSoft
        </Link>
        <div className="flex gap-6 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-brand-600">
            Get a Quote
          </Link>
          <Link to="/book" className="hover:text-brand-600">
            Book a Meeting
          </Link>
          <Link to="/admin/login" className="hover:text-brand-600">
            Admin Login
          </Link>
        </div>
      </div>
    </nav>;
}
