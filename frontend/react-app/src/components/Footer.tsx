import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Sección 1: Acerca de */}
          <div>
            <h3 className="text-lg font-bold mb-3 text-violet-400">
              Project Planning
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Plataforma para la gestión y coordinación de proyectos comunitarios, 
              conectando ONGs y recursos para un impacto positivo.
            </p>
          </div>

          {/* Sección 2: Enlaces Rápidos */}
          <div>
            <h3 className="text-lg font-bold mb-3 text-violet-400">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/projects" className="text-gray-400 hover:text-violet-400 transition-colors">
                  📋 Proyectos
                </a>
              </li>
              <li>
                <a href="/create-project" className="text-gray-400 hover:text-violet-400 transition-colors">
                  ➕ Crear Proyecto
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-violet-400 transition-colors">
                  ℹ️ Acerca de
                </a>
              </li>
            </ul>
          </div>

          {/* Sección 3: Contacto */}
          <div>
            <h3 className="text-lg font-bold mb-3 text-violet-400">
              Contacto
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                📧 <span>info@projectplanning.org</span>
              </li>
              <li className="flex items-center gap-2">
                📍 <span>La Plata, Buenos Aires, AR</span>
              </li>
              <li className="flex items-center gap-2">
                📞 <span>+54 221 XXX-XXXX</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} Project Planning - Proyectos Comunitarios. Todos los derechos reservados.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors">
                Privacidad
              </a>
              <span className="text-gray-600">•</span>
              <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors">
                Términos
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
