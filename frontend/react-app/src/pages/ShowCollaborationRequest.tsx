import React, { useCallback } from 'react';
import { api } from '../api/api';
import ShowProjectsBase from './ShowProjectsBase';

const ShowCollaborationRequest: React.FC = () => {
  const fetchProjects = useCallback(() => api.getCollaborationRequests(), []);

  return (
    <ShowProjectsBase
      fetchProjects={fetchProjects}
      showCommitActions={true}
      title="📋 Pedidos de Colaboración"
      subtitle="Gestiona y responde a las necesidades de los proyectos comunitarios"
    />
  );
};

export default ShowCollaborationRequest;