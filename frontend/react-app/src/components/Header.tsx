import React from "react";
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="bg-violet-600 text-white px-6 py-3 flex items-center justify-between fixed top-0 left-0 w-full shadow-md z-50">
      {/* Logo / Nombre */}
      <h2 className="text-lg font-semibold">Project Planning</h2>

      {/* Menú a la derecha */}
      <nav className="flex-1 flex justify-end space-x-6">
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
        {/* Si ya está en el inicio, el botón de Inicio no debe aparecer */}
        {location.pathname !== '/' && (
          <Link to="/">
            <button className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200">
              Inicio
            </button>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
