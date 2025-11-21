import React from 'react';
import { Link } from 'react-router-dom';

interface UnauthenticatedPageProps {
  authType: 'local' | 'cloud';
}

const UnauthenticatedPage: React.FC<UnauthenticatedPageProps> = ({ authType }) => {
  const isLocal = authType === 'local';

  const title = isLocal
    ? '🔒 Acceso Restringido: Local'
    : '🔒 Acceso Restringido: Cloud';
  
  const subtitle = isLocal
    ? 'No estás autenticado en el entorno Local. Debes iniciar sesión para acceder a esta funcionalidad.'
    : 'No estás autenticado en el entorno Cloud. Debes iniciar sesión con el checkbox "Loguearse también en Cloud" para acceder a esta funcionalidad.';

  const emoji = isLocal ? '🏠' : '☁️';
  
  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-red-200">
        <div className="text-6xl mb-4 text-red-500">{emoji}</div>
        <h1 className="text-3xl font-bold text-red-700 mb-2">
          {title}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          <span dangerouslySetInnerHTML={{ __html: subtitle }} />
        </p>
        <Link 
          to="/login"
          className="inline-block bg-violet-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-violet-700 transition-colors shadow-lg transform hover:scale-105"
        >
          Ir a Iniciar Sesión
        </Link>
      </div>
    </div>
  );
};

export default UnauthenticatedPage;