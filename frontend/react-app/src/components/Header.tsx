import React from "react";
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between fixed top-0 left-0 w-full shadow-md z-50">
      {/* Logo / Nombre */}
      <h2 className="text-lg font-semibold">Project Planning</h2>

      {/* Menú centrado */}
      <nav className="flex-1 flex justify-center space-x-6">
        <Link to="/login">
          <button className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200">
            Login
          </button>
        </Link>
        <Link to="/create-project">
          <button className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200">
            Crear Proyecto
          </button>
        </Link>
        <Link to="/projects">
          <button className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200">
            Ver Proyectos
          </button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
