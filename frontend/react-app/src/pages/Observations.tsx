import React, { useState, useEffect } from 'react'; // 👈 Se quita 'useCallback' que no se usaba
import { api } from '../api/api';
import { type ShowProject } from '../types/project.types';
import { type Task } from '../types/task.types';

// --- Constantes de Paginación ---
const ITEMS_PER_PAGE = 5; // Proyectos por página

const Observations: React.FC = () => {
  // --- Estados del Componente ---
  const [projects, setProjects] = useState<ShowProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para expandir/colapsar
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);

  // --- Estado de Paginación ---
  const [currentPage, setCurrentPage] = useState(1);

  // --- Estados del Modal ---
  const [showObservationModal, setShowObservationModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ShowProject | null>(null);
  const [observationText, setObservationText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Carga de Datos ---
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await api.getExecutionProjects(); 
        setProjects(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar proyectos');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // --- Manejadores de Eventos ---
  const handleProjectClick = (projectId: number) => {
    setExpandedProjectId(prevId => (prevId === projectId ? null : projectId));
  };

  // --- Manejadores del Modal ---
  const handleOpenModal = (project: ShowProject) => {
    setSelectedProject(project);
    setObservationText("");
    setShowObservationModal(true);
  };

  const handleCloseModal = () => {
    setShowObservationModal(false);
    setSelectedProject(null);
    setObservationText("");
  };

  const handleSubmitObservation = async () => {
    if (!selectedProject || !observationText.trim()) return;
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación de API
      console.log("Observación enviada:", { projectId: selectedProject.id, observationText });
      alert("Observación enviada (simulado)");
      handleCloseModal();
    } catch (err) {
      alert("Error al enviar la observación.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Lógica de Renderizado (Helpers) ---
  const getStatusBadge = (status: string) => { /* ... (sin cambios) ... */ 
    const styles: { [key: string]: string } = { active: "bg-blue-100 text-blue-800", execution: "bg-yellow-100 text-yellow-800", finished: "bg-green-100 text-green-800", default: "bg-gray-100 text-gray-800" };
    const labels: { [key: string]: string } = { active: "Activo", execution: "En Ejecución", finished: "Finalizado", default: status.charAt(0).toUpperCase() + status.slice(1) };
    const style = styles[status] || styles.default;
    const label = labels[status] || labels.default;
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style}`}>{label}</span>;
  };

  const getTaskStatusBadge = (status: string) => { /* ... (sin cambios) ... */ 
    const styles: { [key: string]: string } = { pending: "bg-yellow-100 text-yellow-800", resolved: "bg-green-100 text-green-800", default: "bg-gray-100 text-gray-800" };
    const labels: { [key: string]: string } = { pending: "Pendiente", resolved: "Resuelta", default: status.charAt(0).toUpperCase() + status.slice(1) };
    const style = styles[status] || styles.default;
    const label = labels[status] || labels.default;
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style}`}>{label}</span>;
  };


  // --- Lógica de Paginación ---
  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProjects = projects.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setExpandedProjectId(null); // Colapsar filas al cambiar de página
  };

  // --- Renderizado del Componente ---

  if (loading) { /* ... (sin cambios) ... */ 
    return <div className="flex justify-center items-center min-h-[400px]"><div className="text-center"><div className="text-6xl mb-4">⏳</div><div className="text-xl text-violet-600 font-semibold">Cargando mis proyectos...</div></div></div>;
  }
  if (error) { /* ... (sin cambios) ... */ 
    return <div className="max-w-2xl mx-auto mt-8"><div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"><h3 className="font-bold">Error al cargar los proyectos</h3><p>{error}</p></div></div>;
  }

  return (
    <div className="w-full">
      {/* Header de la página */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Observaciones
        </h1>
        <p className="text-lg text-gray-600">
          Acá podes enviar observaciones sobre los proyectos que ya se encuentran en ejecución.
        </p>
      </div>

      {/* Tabla de Proyectos */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Cabecera de la tabla */}
            <thead className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Proyecto</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Descripción</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Tareas</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            {/* Cuerpo de la tabla */}
            <tbody className="divide-y divide-gray-200">
              {/* 🔽 Modificado para mostrar mensaje correcto 🔽 */}
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No tienes proyectos asignados.
                  </td>
                </tr>
              ) : currentProjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No se encontraron proyectos en esta página.
                  </td>
                </tr>
              ) : (
                // 🔽 Modificado para iterar sobre `currentProjects` 🔽
                currentProjects.map((project) => (
                  <React.Fragment key={project.id}>
                    {/* === FILA PRINCIPAL (PROYECTO) === */}
                    <tr 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleProjectClick(project.id)}
                    >
                      {/* ... (Celdas de proyecto sin cambios) ... */}
                      <td className="px-6 py-4"><div className="font-semibold text-gray-900">{project.name}</div></td>
                      <td className="px-6 py-4"><div className="text-sm text-gray-700 max-w-xs">{project.description}</div></td>
                      <td className="px-6 py-4">{getStatusBadge(project.status)}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                          {project.tasks.length} {project.tasks.length === 1 ? 'Tarea' : 'Tareas'}
                          <span className={`ml-2 transform transition-transform ${expandedProjectId === project.id ? 'rotate-180' : 'rotate-0'}`}>▼</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenModal(project); }}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors shadow-sm"
                        >
                          Cargar Observación
                        </button>
                      </td>
                    </tr>

                    {/* === FILA DESPLEGABLE (TAREAS) === */}
                    {expandedProjectId === project.id && (
                      <tr className="bg-violet-50">
                        <td colSpan={5} className="p-0">
                          <div className="p-4 overflow-hidden transition-all duration-300 ease-in-out">
                            <h4 className="text-base font-semibold text-violet-800 mb-3 ml-2">Tareas del Proyecto</h4>
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                              <table className="w-full">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Título</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Necesidad</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Cantidad</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Período</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Estado</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {project.tasks.length === 0 ? (
                                    <tr><td colSpan={5} className="px-4 py-4 text-center text-gray-500 text-sm">Este proyecto no tiene tareas definidas.</td></tr>
                                  ) : (
                                    project.tasks.map((task: Task) => (
                                      <tr key={task.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-800 font-medium">{task.title}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{task.necessity}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{task.quantity}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                          <div className="flex flex-col">
                                            <span><span className="font-semibold text-gray-800">Inicio:</span> {task.start_date}</span>
                                            <span><span className="font-semibold text-gray-800">Fin:</span> {task.end_date}</span>
                                          </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{getTaskStatusBadge(task.status)}</td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 🔽 --- SECCIÓN DE PAGINACIÓN --- 🔽 */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Mostrando {startIndex + 1} a {Math.min(endIndex, projects.length)} de {projects.length} proyectos
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  ← Anterior
                </button>
                
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToPage(idx + 1)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                        currentPage === idx + 1
                          ? 'bg-violet-600 text-white shadow-md'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          </div>
        )}
        {/* 🔼 --- FIN DE SECCIÓN DE PAGINACIÓN --- 🔼 */}

      </div>

      {/* --- Modal para Cargar Observación --- */}
      {showObservationModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-fadeIn">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Cargar Observación
            </h3>
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                <p className="text-sm font-semibold text-gray-900 mb-1">Proyecto:</p>
                <p className="text-gray-700 font-bold">{selectedProject.name}</p>
              </div>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observación *
              </label>
              <textarea
                value={observationText}
                onChange={(e) => setObservationText(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Escribe tu observación aquí..."
                disabled={isSubmitting}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleSubmitObservation}
                disabled={!observationText.trim() || isSubmitting}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enviando...' : 'Guardar Observación'}
              </button>
              <button
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Observations;