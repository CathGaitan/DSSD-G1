import React from 'react';
import { ShowObservationsBase } from '../pages/ShowObservationsBase';
import { api } from '../api/api';

const ShowObservationsManager: React.FC = () => {
  return (
    <ShowObservationsBase
      title="Mis Observaciones Enviadas"
      subtitle="Historial de comentarios y correcciones que has enviado a otros proyectos."
      fetchData={api.getMyObservationsManager}
    />
  );
};

export default ShowObservationsManager;