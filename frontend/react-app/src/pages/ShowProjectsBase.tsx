import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api/api';
import { type ShowProject } from '../types/project.types';
import { type Ong } from '../types/ong.types';
import { type Task } from '../types/task.types';

interface ShowProjectsBaseProps {
  // Configuración del comportamiento
  fetchProjects: () => Promise<ShowProject[]>;
  showCommitActions?: boolean;
  showOrganizerColumn?: boolean; 
  title?: string;
  subtitle?: string;
}

const ShowProjectsBase: React.FC<ShowProjectsBaseProps> = ({
  fetchProjects,
  showCommitActions = false,
  showOrganizerColumn = true, 
  title = '📋 Pedidos de Colaboración',
  subtitle = 'Gestiona y responde a las necesidades de los proyectos comunitarios'
}) => {
  // --- Estados ---
  const [projects, setProjects] = useState<ShowProject[]>([]);
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);
  
  // Estados para el Modal de "Comprometer"
  const [showCommitModal, setShowCommitModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  
  // Estados generales
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>('todos'); 
  const [filterOngId, setFilterOngId] = useState<string>('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- Estados de ONGs ---
  const [myOngs, setMyOngs] = useState<Ong[]>([]); // Para el modal de "comprometer"
  const [allOngsMap, setAllOngsMap] = useState<Map<number, string>>(new Map()); // Para mostrar nombres de organizadores

  const itemsPerPage = 5;

  // --- Carga de Datos ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const projectsPromise = fetchProjects();
        const userPromise = api.getCurrentUser();
        
        const allOngsPromise = showOrganizerColumn 
          ? api.getOngs()
          : Promise.resolve([]);
        
        const [projectsData, userData, allOngsData] = await Promise.all([
          projectsPromise,
          userPromise,
          allOngsPromise
        ]);
        console.log('Fetched Projects:', projectsData);
        
        setProjects(projectsData);
        setMyOngs(userData.ongs || []);
        
        if (allOngsData.length > 0) {
          const newOngMap = new Map<number, string>();
          allOngsData.forEach((ong: Ong) => newOngMap.set(ong.id, ong.name));
          setAllOngsMap(newOngMap);
        }
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchProjects, showOrganizerColumn]);

  // --- Manejadores de Eventos ---

  const handleProjectClick = (projectId: number) => {
    setExpandedProjectId(prevId => (prevId === projectId ? null : projectId));
  };

  const handleCommit = (task: Task) => {
    setSelectedTask(task);
    setShowCommitModal(true);
  };

  const confirmCommit = async () => {
    if (selectedTask && selectedOrgId) {
      try {
        await api.commitTaskToOng(selectedTask.id, selectedOrgId, 3);
        
        setShowCommitModal(false);
        setSelectedOrgId(null);
        setSelectedTask(null);
        
        const projectsData = await fetchProjects();
        setProjects(projectsData);
        
      } catch (error) {
        console.error('Error al comprometer la ayuda:', error);
        alert('Error al guardar el compromiso. Intenta de nuevo.');
      }
    }
  };

  // --- Lógica de Renderizado ---

  const getStatusBadge = (status: string) => {
    const styles: { [key: string]: string } = {
      active: "bg-blue-100 text-blue-800",       
      execution: "bg-yellow-100 text-yellow-800", 
      finished: "bg-green-100 text-green-800",   
      default: "bg-gray-100 text-gray-800"
    };
    const labels: { [key: string]: string } = {
      active: "Activo",
      execution: "En Ejecución",
      finished: "Finalizado",
      default: status.charAt(0).toUpperCase() + status.slice(1) 
    };

    const style = styles[status] || styles.default;
    const label = labels[status] || labels.default;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style}`}>
        {label}
      </span>
    );
  };

  // Badge para estado de TAREA
  const getTaskStatusBadge = (status: string) => {
    const styles: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800",
      resolved: "bg-green-100 text-green-800",
      interested: "bg-blue-100 text-blue-800",
      selected: "bg-green-100 text-green-800",
      owner: "bg-indigo-100 text-indigo-800",
      rejected: "bg-red-100 text-red-800",
      default: "bg-gray-100 text-gray-800"
    };
    
    const labels: { [key: string]: string } = {
      pending: "Pendiente",
      resolved: "Resuelta",
      interested: "Interesado",
      selected: "Seleccionada",
      owner: "Propia",
      rejected: "Rechazada",
      default: status.charAt(0).toUpperCase() + status.slice(1)
    };

    const style = styles[status] || styles.default;
    const label = labels[status] || labels.default;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style}`}>
        {label}
      </span>
    );
  };


  // Filtrar Proyectos
  const filteredProjects = projects.filter(project => {
    const statusMatch = filterStatus === 'todos' || project.status === filterStatus;
    
    let ongMatch = true; 
    if (!showOrganizerColumn) { // Si estamos en "Mis Tareas"
      ongMatch = filterOngId === 'todos' || project.owner_id === parseInt(filterOngId, 10);
    }

    return statusMatch && ongMatch;
  });

  // Paginación
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  // Mostrar loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <div className="text-xl text-violet-600 font-semibold">Cargando proyectos...</div>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
     return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">⚠️</span>
            <h3 className="font-bold">Error al cargar los proyectos</h3>
          </div>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header y Filtros */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
            <p className="text-lg text-gray-600">
              {subtitle}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-violet-600">{filteredProjects.length}</div>
            <div className="text-sm text-gray-500">Cantidad de proyectos</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 mt-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="todos">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="execution">En Ejecución</option>
              <option value="finished">Finalizado</option>
            </select>
          </div>
          
          {/* Filtro de ONG (Solo en "Mis Tareas") */}
          {!showOrganizerColumn && myOngs.length > 0 && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mi ONG
              </label>
              <select
                value={filterOngId}
                onChange={(e) => {
                  setFilterOngId(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                {myOngs.map((ong) => (
                  <option key={ong.id} value={ong.id}>
                    {ong.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Tabla de Proyectos */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* === CABECERA DE PROYECTOS === */}
            <thead className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Proyecto</th>
                
                {/* 👇 --- CABECERA DE ONG (CONDICIONAL) --- 👇 */}
                {showOrganizerColumn && (
                  <th className="px-6 py-4 text-left text-sm font-semibold">ONG Organizadora</th>
                )}
                
                <th className="px-6 py-4 text-left text-sm font-semibold">Descripción</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Fecha Término</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Tareas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentProjects.map((project) => (
                <React.Fragment key={project.id}>
                  {/* === FILA PRINCIPAL (PROYECTO) === */}
                  <tr 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{project.name}</div>
                      <div className="text-xs text-gray-500">Inicia: {project.start_date}</div>
                    </td>

                    {/* 👇 --- CELDA DE ONG (CONDICIONAL) --- 👇 */}
                    {showOrganizerColumn && (
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-800">
                          {allOngsMap.get(project.owner_id) || 'Desconocida'}
                        </span>
                      </td>
                    )}
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 max-w-xs">{project.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{project.end_date}</span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(project.status)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {project.tasks.length} {project.tasks.length === 1 ? 'Tarea' : 'Tareas'}
                        <span className={`ml-2 transform transition-transform ${expandedProjectId === project.id ? 'rotate-180' : 'rotate-0'}`}>
                          ▼
                        </span>
                      </span>
                    </td>
                  </tr>

                  {/* === FILA DESPLEGABLE (TAREAS) === */}
                  {expandedProjectId === project.id && (
                    <tr className="bg-violet-50">
                      {/* 👇 --- COLSPAN ACTUALIZADO (CONDICIONAL) --- 👇 */}
                      <td colSpan={showOrganizerColumn ? 6 : 5} className="p-0">
                        <div className="p-4 overflow-hidden transition-all duration-300 ease-in-out">
                          <h4 className="text-base font-semibold text-violet-800 mb-3 ml-2">Tareas del Proyecto</h4>
                          
                          {/* Tabla Anidada de Tareas */}
                          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <table className="w-full">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Título</th>
                                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Necesidad</th>
                                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Cantidad</th>
                                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Período</th>
                                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Estado</th>
                                  {showCommitActions && (
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Acciones</th>
                                  )}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {project.tasks.map((task) => (
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
                                    <td className="px-4 py-3 text-sm">
                                      {getTaskStatusBadge(task.status)}
                                    </td>
                                    {showCommitActions && (
                                      <td className="px-4 py-3">
                                        <button
                                          onClick={() => handleCommit(task)}
                                          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors shadow-sm"
                                        >
                                          Comprometer
                                        </button>
                                      </td>
                                    )}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- Paginación --- */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredProjects.length)} de {filteredProjects.length} proyectos
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  ← Anterior
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal para Comprometer Ayuda */}
      {showCommitActions && showCommitModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-fadeIn">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Comprometer Ayuda
            </h3>
            <div className="mb-6">
              <div className="bg-violet-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-violet-900 mb-1">Tarea:</p>
                <p className="text-gray-700 font-bold">{selectedTask.title}</p>
                <p className="text-sm font-semibold text-violet-900 mb-1 mt-2">Pedido:</p>
                <p className="text-gray-700">{selectedTask.necessity}</p>
                <p className="text-sm font-semibold text-violet-900 mb-1 mt-2">Cantidad:</p>
                <p className="text-gray-700">{selectedTask.quantity}</p>
              </div>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecciona tu Organización *
              </label>
              <select
                value={selectedOrgId || ''}
                onChange={(e) => setSelectedOrgId(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="">-- Selecciona una organización --</option>
                {/* Sigue usando myOngs, lo cual es correcto para este modal */}
                {myOngs.map(org => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={confirmCommit}
                disabled={!selectedOrgId}
                className="flex-1 px-6 py-3 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar Compromiso
              </button>
              <button
                onClick={() => {
                  setShowCommitModal(false);
                  setSelectedOrgId(null);
                  setSelectedTask(null);
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje si no hay resultados */}
      {currentProjects.length === 0 && (
         <div className="bg-white rounded-2xl shadow-xl p-12 text-center mt-8">
          <div className="text-6xl mb-4">🔭</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No se encontraron proyectos
          </h3>
          <p className="text-gray-600">
            Intenta ajustar los filtros para ver más resultados
          </p>
        </div>
      )}
    </div>
  );
};

export default ShowProjectsBase;