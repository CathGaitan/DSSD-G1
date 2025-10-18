import React, { useCallback } from 'react';
import { api } from '../api/api';
import ShowProjectsBase from './ShowProjectsBase';

const ShowProjectsCloud: React.FC = () => {
  const fetchProjects = useCallback(() => api.getCloudProjects(), []);

  return (
    <ShowProjectsBase
      fetchProjects={fetchProjects}
      showCommitActions={true}
      title="📋 Pedidos de Colaboración"
      subtitle="Gestiona y responde a las necesidades de los proyectos comunitarios"
    />
  );
};

export default ShowProjectsCloud;