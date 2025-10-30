const BASE_CLOUD_URL = 'http://localhost:10000';
const BASE_LOCAL_URL = 'http://localhost:8000';

export const api = {

  // GET: Obtener todos los proyectos en Cloud
  getCloudProjects: async () => {
    const response = await fetch(`${BASE_CLOUD_URL}/api/projects/`);
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
      const response = await fetch(`${BASE_LOCAL_URL}/projects/my-projects/`);
      if (!response.ok) throw new Error('Error al cargar proyectos');
      return response.json();
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
  login: async (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append("grant_type", "password");
    formData.append("username", username);
    formData.append("password", password);

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