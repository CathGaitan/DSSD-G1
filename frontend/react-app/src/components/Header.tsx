import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Detectamos si el usuario está logueado (existe token)
  const isAuthenticated = !!localStorage.getItem("token");

  const navItems = [
    { path: "/register", label: "Registrarse", icon: "" },
    { path: '/login', label: 'Login', icon: '' },
    { path: '/create-project', label: 'Crear Proyecto', icon: '' },
    { path: '/cloud-projects', label: 'Ver pedidos colaboracion', icon: '' },
    { path: '/local-projects', label: 'Mis tareas', icon: '' },
    { path: '/observations', label: 'Observaciones', icon: '' },
  ];

  // Filtramos los botones que no deben mostrarse según la ruta actual
  const visibleNavItems = navItems.filter((item) => {
    if (location.pathname === "/register" && item.path === "/register") return false;
    if (location.pathname === "/login" && item.path === "/login") return false;
    if (isAuthenticated && (item.path === "/login" || item.path === "/register"))
      return false; // 🔒 Ocultamos Login y Registro si ya está autenticado
    return true;
  });

  // 🔐 Función de logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login"); // redirige al login
  };

  return (
    <header className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-4 sm:px-6 py-3 flex items-center justify-between fixed top-0 left-0 w-full shadow-lg z-50 backdrop-blur-sm bg-opacity-95">
      {/* Logo / Nombre */}
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
        {visibleNavItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <button
              className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2 text-sm ${
                location.pathname === item.path
                  ? "bg-white text-violet-600 shadow-md"
                  : "bg-violet-700 bg-opacity-50 hover:bg-white hover:text-violet-600 hover:shadow-md"
              }`}
            >
              <span>{item.icon}</span>
              <span className="hidden md:inline">{item.label}</span>
            </button>
          </Link>
        ))}

        {/* Botón de Logout condicional */}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white shadow-md transition-all flex items-center gap-2 text-sm"
          >
            🚪 <span className="hidden md:inline">Logout</span>
          </button>
        )}

        {/* Botón de Inicio condicional */}
        {location.pathname !== "/" && (
          <Link to="/">
            <button className="px-3 py-2 rounded-lg font-medium bg-violet-700 bg-opacity-50 hover:bg-white hover:text-violet-600 hover:shadow-md transition-all flex items-center gap-2 text-sm">
              🏠 <span className="hidden md:inline">Inicio</span>
            </button>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
