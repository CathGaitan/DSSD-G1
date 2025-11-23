import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem("token"); 
  const isAuthenticatedLocal = !!localStorage.getItem("local_token");
  const isAuthenticatedCloud = !!localStorage.getItem("cloud_token");

  const navItems = [
    { path: "/register", label: "Registrarse", icon: "" },
    { path: '/login', label: 'Login', icon: '' },
    { path: '/create-project', label: 'Crear Proyecto', icon: '' },
    { path: '/local-projects', label: 'Mis tareas', icon: '' },
    { path: '/cloud-projects', label: 'Mis tareas en cloud', icon: '' },
    { path: '/colaboration-requests', label: 'Pedidos colaboración', icon: '' },
    { path: '/select-requests', label: 'Elegir pedido', icon: '' },
    { path: '/show_obs_ong', label: 'Observaciones', icon: '' },
    { path: '/observations', label: 'Enviar observaciones', icon: '' },
    { path: '/show_obs_manager', label: 'Mis observaciones', icon: '' },
  ];

  const visibleNavItems = navItems.filter((item) => {
    const isAuthPath = item.path === "/login" || item.path === "/register";
    const isLocalTierPath = item.path === '/local-projects' || item.path === '/create-project';
    const isCloudTierPath = item.path === '/cloud-projects' || item.path === '/observations' || item.path === '/select-requests' || item.path === '/colaboration-requests';
    
    if (isAuthPath) {
        if (isAuthenticatedLocal) {
            return false;
        }
        return location.pathname !== item.path;
    }

    if (isCloudTierPath) {
        // Corrección: Pedidos colaboración es Cloud Tier
        return isAuthenticatedCloud;
    }

    if (isLocalTierPath) {
        return isAuthenticatedLocal;
    }

    return true;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("local_token");
    localStorage.removeItem("cloud_token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-4 sm:px-6 py-3 flex items-center justify-between fixed top-0 left-0 w-full shadow-lg z-50 backdrop-blur-sm bg-opacity-95">
      <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
        <div className="bg-white text-violet-600 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-110 transition-transform">
          P
        </div>
        <h2 className="text-lg sm:text-xl font-bold tracking-tight group-hover:text-violet-200 transition-colors">
          Project Planning
        </h2>
      </Link>

      <nav className="flex items-center gap-2">
        {visibleNavItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <Link to={item.path}>
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
            {isAuthenticatedLocal && isAuthenticatedCloud && item.path === '/local-projects' && (
                <span className="text-gray-300 opacity-70 text-lg font-thin hidden sm:inline">
                    |
                </span>
            )}
            
          </React.Fragment>
        ))}

        {isAuthenticatedLocal && (
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white shadow-md transition-all flex items-center gap-2 text-sm"
          >
            🚪 <span className="hidden md:inline">Logout</span>
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;