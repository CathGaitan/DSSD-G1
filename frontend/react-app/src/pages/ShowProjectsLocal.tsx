import React, { useCallback } from 'react';
import { api } from '../api/api';
import ShowProjectsBase from './ShowProjectsBase';

const ShowProjectsLocal: React.FC = () => {
  const fetchProjects = useCallback(() => api.getMyProjects(), []);

  return (
    <ShowProjectsBase
      fetchProjects={fetchProjects}
      showCommitActions={false}
      showOrganizerColumn={false}
      title="Mis Tareas"
      subtitle="Visualiza las tareas de tus proyectos"
    />
  );
};

export default ShowProjectsLocal;