export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <p className="font-display text-white font-bold text-lg mb-2">DigitalSoft</p>
          <p className="text-sm text-gray-400 mb-3">
            Building AI-powered solutions for growing businesses since 2004.
          </p>
          <p className="text-xs text-gray-500">
            Offices also in Lahore, Karachi, Rawalpindi, USA, and UK.
          </p>
        </div>

        <div>
          <p className="text-white font-semibold text-sm mb-3">Head Office - Faisalabad</p>
          <ul className="space-y-1 text-sm text-gray-400">
            <li>Sitara Techno Park, Lower Canal Road, People's Colony No 1, Faisalabad, Pakistan</li>
            <li>+92 41 8535044</li>
            <li>info@digitalsofts.pk</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} DigitalSoft. All rights reserved.
      </div>
    </footer>
  );
}
