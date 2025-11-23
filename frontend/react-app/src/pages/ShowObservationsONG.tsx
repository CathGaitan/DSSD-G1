import React, { useState } from 'react';
import { ShowObservationsBase } from '../pages/ShowObservationsBase';
import { api } from '../api/api';
import type { Observation } from '../types/observation.types';
import { Alert, useAlert } from '../components/ui/Alert';

const ShowObservationsONG: React.FC = () => {
  // Estados para el manejo del Modal y la Carga
  const [selectedObsId, setSelectedObsId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Hook de alertas personalizado
  const { alert, showAlert, closeAlert } = useAlert();

  // Abrir el modal seleccionando la ID
  const handleOpenModal = (id: number) => {
    setSelectedObsId(id);
  };

  // Cerrar el modal y limpiar el estado
  const handleCloseModal = () => {
    setSelectedObsId(null);
  };

  // Lógica para confirmar la aceptación
  const handleConfirmAccept = async () => {
    if (!selectedObsId) return;

    setIsSubmitting(true);
    try {
        await api.acceptObservation(selectedObsId);
        
        showAlert('success', 'Observación aceptada correctamente');
        handleCloseModal();
        setTimeout(() => {
            window.location.reload(); 
        }, 1500);

    } catch (error) {
        console.error(error);
        showAlert('error', 'Ocurrió un error al aceptar la observación');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Componente de Alerta Global */}
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={closeAlert}
        />
      )}

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
                // Cambiamos la llamada directa por la apertura del modal
                onClick={() => handleOpenModal(obs.id)}
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

      {/* === MODAL DE CONFIRMACIÓN === */}
      {selectedObsId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-100 transform transition-all scale-100">
            
            {/* Icono y Título */}
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">¿Aceptar Observación?</h3>
              <p className="text-sm text-gray-500 mt-2">
                Al aceptar, confirmarás que has revisado y estás de acuerdo con el contenido de esta observación.
              </p>
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2.5 bg-gray-100 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmAccept}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg transition-colors flex justify-center items-center"
              >
                {isSubmitting ? (
                    <>
                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     Procesando...
                    </>
                ) : 'Sí, Aceptar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowObservationsONG;