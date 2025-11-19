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

  // GET: Obtener todos los proyectos en Cloud
  getCloudProjects: async () => {
    const token = localStorage.getItem('cloud_token');
     const response = await fetch(`${BASE_CLOUD_URL}/api/projects/get_projects_not_owned_by_and_active`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error('Error al cargar proyectos');
    return response.json();
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
        fetch(`${BASE_CLOUD_URL}/api/projects/projects_status/execution/`, {
            headers: {
                "Authorization": `Bearer ${cloud_token}`,
            },
        }),
        fetch(`${BASE_LOCAL_URL}/projects/projects_status/execution/`, {
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
    console.log('Response:', response);
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

    return response.json(); // devuelve el token
  },
  
};