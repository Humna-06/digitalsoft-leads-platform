import { Link } from "react-router-dom";
export default function Navbar() {
  return <nav className="bg-white/80 backdrop-blur border-b border-gray-100 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold text-gray-900 flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-spark-500" />
          DigitalSoft
        </Link>
        <div className="flex gap-6 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-spark-600 transition">
            Get a Quote
          </Link>
          <Link to="/book" className="hover:text-spark-600 transition">
            Book a Meeting
          </Link>
          <Link to="/admin/login" className="hover:text-spark-600 transition">
            Admin Login
          </Link>
          <a href="#contact" className="hover:text-spark-600 transition">
            Contact
          </a>
        </div>
      </div>
    </nav>;
}
