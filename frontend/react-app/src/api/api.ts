const API_BASE_URL = 'http://localhost:10000';

export const api = {

  // GET: Obtener todos los proyectos
  getProjects: async () => {
    const response = await fetch(`${API_BASE_URL}/api/projects/`);
    if (!response.ok) throw new Error('Error al cargar proyectos');
    return response.json();
  },

  //GET: Obtener las ONGs
  getOngs: async () => {
    const response = await fetch(`${API_BASE_URL}/api/ongs/`);
    if (!response.ok) throw new Error('Error al cargar ONGs');
    return response.json();
  },
  
  // POST: Comprometer una tarea a una ONG
  commitTaskToOng: async (taskId: number, ongId: number) => {

    const response = await fetch(`${API_BASE_URL}/api/tasks/task_compromise`, {
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
  
};