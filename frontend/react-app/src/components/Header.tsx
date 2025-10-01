import React from "react";
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/login', label: 'Login', icon: '' },
    { path: '/create-project', label: 'Crear Proyecto', icon: '' },
    { path: '/projects', label: 'Ver Proyectos', icon: '' },
  ];

  return (
    <header className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-4 sm:px-6 py-3 flex items-center justify-between fixed top-0 left-0 w-full shadow-lg z-50 backdrop-blur-sm bg-opacity-95">
      {/* Logo / Nombre con animación */}
      <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
        <div className="bg-white text-violet-600 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-110 transition-transform">
          P
        </div>
        <h2 className="text-lg sm:text-xl font-bold tracking-tight group-hover:text-violet-200 transition-colors">
          Project Planning
        </h2>
      </Link>

      {/* Menú de navegación */}
      <nav className="flex items-center gap-2">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <button
              className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2 text-sm ${
                location.pathname === item.path
                  ? 'bg-white text-violet-600 shadow-md'
                  : 'bg-violet-700 bg-opacity-50 hover:bg-white hover:text-violet-600 hover:shadow-md'
              }`}
            >
              <span>{item.icon}</span>
              <span className="hidden md:inline">{item.label}</span>
            </button>
          </Link>
        ))}
        
        {/* Botón de Inicio condicional */}
        {location.pathname !== '/' && (
          <Link to="/">
            <button className="px-3 py-2 rounded-lg font-medium bg-violet-700 bg-opacity-50 hover:bg-white hover:text-violet-600 hover:shadow-md transition-all flex items-center gap-2 text-sm">
              <span>🏠</span>
              <span className="hidden md:inline">Inicio</span>
            </button>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;