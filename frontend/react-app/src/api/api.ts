const BASE_CLOUD_URL = 'http://localhost:10000';
const BASE_LOCAL_URL = 'http://localhost:8000';

export const api = {

  // GET: Obtener todos los proyectos en Cloud
  getCloudProjects: async () => {
    const token = localStorage.getItem('cloud_token');
     const response = await fetch(`${BASE_CLOUD_URL}/api/projects/`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error('Error al cargar proyectos');
    return response.json();
  },

  //GET: Obtener las ONGs
  getOngs: async () => {
    const response = await fetch(`${BASE_CLOUD_URL}/api/ongs/`);
    if (!response.ok) throw new Error('Error al cargar ONGs');
    return response.json();
  },

  // GET: Obtener todos los proyectos en BD local
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
  
  //CAMBIAR - DEBE PEGAR A BACK LOCAL QUE ARRANQUE TASK DE BONITA
  // POST: Comprometer una tarea a una ONG
  commitTaskToOng: async (taskId: number, ongId: number) => {

    const response = await fetch(`${BASE_CLOUD_URL}/api/tasks/task_compromise`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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

    return response.json(); // devuelve el token
  },
  
};