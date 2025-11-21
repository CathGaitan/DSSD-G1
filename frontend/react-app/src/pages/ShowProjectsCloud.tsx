import React, { useCallback } from 'react';
import { api } from '../api/api';
import ShowProjectsBase from './ShowProjectsBase';

const ShowProjectsCloud: React.FC = () => {
  const fetchProjects = useCallback(() => api.getMyCloudProjects(), []);

  return (
    <ShowProjectsBase
      fetchProjects={fetchProjects}
      showCommitActions={false}
      title="📋 Mis tareas en cloud"
      subtitle="Visualiza las tareas que has creado en la nube"
    />
  );
};

export default ShowProjectsCloud;