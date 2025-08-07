export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">ByDaniel</h2>
            <p className="text-gray-400">
              Developer ReactJS with Firebase and taildwind
            </p>
            <p className="text-gray-400">contacto : djuchiha12@gmail.com</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition">
              Instagram
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              Facebook
            </a>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-2 pt-4 text-center text-gray-500">
          <p>&copy; 2025 Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
