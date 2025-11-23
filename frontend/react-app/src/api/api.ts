const BASE_CLOUD_URL = 'http://localhost:10000';
const BASE_LOCAL_URL = 'http://localhost:8000';

export const api = {

  getCurrentUser: async () => {
    const token = localStorage.getItem('local_token');
    if (!token) {
      console.warn("No hay token local, no se pueden obtener datos del usuario.");
      return { ongs: [] };
    }
    const response = await fetch(`${BASE_LOCAL_URL}/users/me`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    
    if (!response.ok) {
        console.error('Error al cargar datos del usuario');
        return { ongs: [] }; 
    }
    
    return response.json();
  },

  // POST: Enviar un proyecto hacia el backend local
  createProject: async (payload: any) => {
    const token = localStorage.getItem('local_token');
    if (!token) {
        throw new Error("No hay token local. Inicia sesión para crear un proyecto.");
    }
    console.log(JSON.stringify(payload));
    const response = await fetch(`${BASE_LOCAL_URL}/projects/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || `Error ${response.status}: No se pudo crear el proyecto`);
    }
    return response.json();
  },

  getMyOngs: async () => {
    const token = localStorage.getItem('local_token');
    if (!token) {
      console.warn("No hay token local, no se pueden obtener ONGs del usuario.");
      return [];
    }
    const response = await fetch(`${BASE_LOCAL_URL}/users/me`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        console.error('Error al cargar ONGs del usuario. Código:', response.status);
        return [];
    }
    const userData = await response.json();
    return userData.ongs || [];
  },

  // GET: Obtener todos los proyectos que se puede colaborar
  getCollaborationRequests: async () => {
    const token = localStorage.getItem('cloud_token');
     const response = await fetch(`${BASE_CLOUD_URL}/api/projects/get_projects_not_owned_by_and_active`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    const res = await response.json();
    if (!response.ok) throw new Error('Error al cargar proyectos');
    return res
  },

  getMyCloudProjects: async () => {
    const token = localStorage.getItem('cloud_token');
     const response = await fetch(`${BASE_CLOUD_URL}/api/projects/my_projects`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    const res = await response.json();
    if (!response.ok) throw new Error('Error al cargar proyectos');
    return res
  },

  getOngs: async () => {
    const response = await fetch(`${BASE_CLOUD_URL}/api/ongs/`);
    if (!response.ok) throw new Error('Error al cargar ONGs');
    return response.json();
  },

  getMyProjects: async () => {
    const token = localStorage.getItem('local_token');
      const response = await fetch(`${BASE_LOCAL_URL}/projects/my-projects/`, {
          headers: {
              "Authorization": `Bearer ${token}`,
          },
      });
      if (!response.ok) throw new Error('Error al cargar proyectos');
      return response.json();
    },
  
  //GET: Obtener todos los proyectos en ejecucion
  getExecutionProjects: async () => {
    const cloud_token = localStorage.getItem('cloud_token');
    const local_token = localStorage.getItem('local_token');
    const [cloud_response, local_response] = await Promise.all([
        fetch(`${BASE_CLOUD_URL}/api/projects/projects_status/execution`, {
            headers: {
                "Authorization": `Bearer ${cloud_token}`,
            },
        }),
        fetch(`${BASE_LOCAL_URL}/projects/projects_status/execution`, {
            headers: {
                "Authorization": `Bearer ${local_token}`,
            },
        })
    ]);
    if (!cloud_response.ok || !local_response.ok) {
        throw new Error('Error al cargar proyectos de una o ambas fuentes');
    }
    const [cloud_projects, local_projects] = await Promise.all([
        cloud_response.json(),
        local_response.json()
    ]);
    return [...cloud_projects, ...local_projects];
  },
  
  // POST: Comprometer una tarea a una ONG
  commitTaskToOng: async (taskId: number, ongId: number, projectId: number) => {
    const local_token = localStorage.getItem('local_token');
    const response = await fetch(`${BASE_LOCAL_URL}/tasks/task_compromise`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${local_token}`,

      },
      body: JSON.stringify({
        project_id: projectId,
        task_id: taskId,
        ong_id: ongId,
      }),
    });
    if (!response.ok) throw new Error('Error al guardar el compromiso');
    return response.json();
  },

  // POST: Login de usuario
  login: async (username: string, password: string, cloud: boolean) => {
    const formData = new URLSearchParams();
    formData.append("grant_type", "password");
    formData.append("username", username);
    formData.append("password", password);
    formData.append("cloud", String(cloud));

    const response = await fetch(`${BASE_LOCAL_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) throw new Error("Credenciales inválidas");

    return response.json();
  },

  checkProjectNameExists: async (name: string): Promise<boolean> => {
        const token = localStorage.getItem('local_token');
        if (!token) {
            throw new Error("No hay token local.");
        }
        const encodedName = encodeURIComponent(name);
        const response = await fetch(`${BASE_LOCAL_URL}/projects/check_name/${encodedName}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (response.status === 404) {
            return false;
        }
        
        if (response.status === 400) {
            return true;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Error desconocido' }));
            throw new Error(errorData.detail || `Error ${response.status}: No se pudo verificar el nombre del proyecto`);
        }
        
        return true;
    },

    getLocalProjectByName: async (name: string) => {
      const token = localStorage.getItem('local_token');
      if (!token) {
          throw new Error("No hay token local.");
      }
      const encodedName = encodeURIComponent(name);
      const response = await fetch(`${BASE_LOCAL_URL}/projects/search_name/${encodedName}`, {
          headers: {
              "Authorization": `Bearer ${token}`,
          },
      });

      if (!response.ok) {
          const data = await response.json().catch(() => ({ detail: `Error ${response.status}` }));
          throw new Error(data.detail || `Error ${response.status}: No se pudo obtener el proyecto local`);
      }
      return response.json();
    },

    // GET: Obtener todos los compromisos (Cloud)
    viewCompromises: async () => {
        const cloud_token = localStorage.getItem('cloud_token');
        const response = await fetch(`${BASE_CLOUD_URL}/api/tasks/view_compromises`, {
            headers: {
                "Authorization": `Bearer ${cloud_token}`,
            },
        });
        if (!response.ok) throw new Error('Error al obtener compromisos');
        return response.json();
    },

    getProjectsWithRequests: async (ownerId: number) => {
      const cloud_token = localStorage.getItem('cloud_token');
      const response = await fetch(`${BASE_CLOUD_URL}/api/projects/projects_with_requests/${ownerId}`, {
          headers: {
              "Authorization": `Bearer ${cloud_token}`,
          },
      });
      if (!response.ok) throw new Error('Error al obtener proyectos con solicitudes');
      return response.json();
    },

    // POST: Seleccionar una ONG para una tarea (Backend Local -> Bonita)
    selectOngForTask: async (taskId: number, ongId: number, projectId: number) => {
        const local_token = localStorage.getItem('local_token');
        const response = await fetch(`${BASE_LOCAL_URL}/tasks/select_ong_for_task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${local_token}`,
            },
            body: JSON.stringify({
                project_id: projectId,
                task_id: taskId,
                ong_id: ongId,
            }),
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.detail || 'Error al seleccionar ONG');
        }
        return response.json();
    },

    // POST: Enviar una observación para un proyecto (Backend Local -> Bonita)
    sendObservation: async (observationText: string, projectName: string, ongId: number) => {
        const local_token = localStorage.getItem('local_token');
        const response = await fetch(`${BASE_LOCAL_URL}/observations/send_observation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${local_token}`,

            },
            body: JSON.stringify({
                content: observationText,
                project_name: projectName,
                ong_id: ongId
            }),
        });
        if (!response.ok) throw new Error('Error al guardar el compromiso');
        return response.json();
  },

    //GET: Obtener observaciones de mis ONGs
    getMyObservations: async () => {
      const cloud_token = localStorage.getItem('cloud_token');
      const response = await fetch(`${BASE_CLOUD_URL}/api/observations/my_observations_ong`, {
          headers: {
              "Authorization": `Bearer ${cloud_token}`,
          },
      });
      if (!response.ok) throw new Error('Error al obtener proyectos con solicitudes');
      return response.json();
    },

};