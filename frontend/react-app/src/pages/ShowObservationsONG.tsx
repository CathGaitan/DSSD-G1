import React from 'react';
import { ShowObservationsBase } from '../pages/ShowObservationsBase';
import { api } from '../api/api';
import type { Observation } from '../types/observation.types';

const ShowObservationsONG: React.FC = () => {
  
  const handleAccept = async (id: number) => {
    try {
        if(window.confirm("¿Deseas aceptar esta observación?")) {
            await api.acceptObservation(id);
            alert("Observación aceptada correctamente");
            window.location.reload(); 
        }
    } catch (error) {
        alert("Error al aceptar");
    }
  };

  return (
    <ShowObservationsBase
      title="Gestión de Observaciones Recibidas"
      subtitle="Revisa y acepta las observaciones realizadas por colaboradores."
      fetchData={api.getMyObservations}
      extraColumns={[
        {
          header: "Usuario",
          width: "w-1/6",
          render: (obs: Observation) => (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                {/* Usamos la inicial del username */}
                {obs.username ? obs.username.charAt(0).toUpperCase() : '?'}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {/* Mostramos el username real */}
                {obs.username}
              </span>
            </div>
          )
        },
        {
          header: "Acciones",
          width: "w-1/6",
          render: (obs: Observation) => (
            <button
              onClick={() => handleAccept(obs.id)}
              className="group flex items-center gap-2 px-4 py-2 bg-white border border-green-200 rounded-lg text-green-700 hover:bg-green-50 hover:border-green-300 transition-all shadow-sm hover:shadow-md"
              title="Aceptar Observación"
            >
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                ✓
              </div>
              <span className="text-sm font-medium">Aceptar</span>
            </button>
          )
        }
      ]}
    />
  );
};

export default ShowObservationsONG;