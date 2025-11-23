import React, { useState, useEffect } from 'react';
import { api } from '../api/api';
import type { Ong } from '../types/ong.types';
import type { ShowProject } from '../types/project.types';
import type { Task } from '../types/task.types';
import { Alert, useAlert } from '../components/ui/Alert';

interface Compromise {
  task_id: number;
  ong_id: number;
  status: string;
  selected_at: string | null;
}

interface SelectionData {
  task: Task;
  projectId: number;
  projectName: string; 
  ongId: number;
  ongName: string;
}

const ITEMS_PER_PAGE = 5;

const SelectRequest: React.FC = () => {
  // --- Estados ---
  const [myOngs, setMyOngs] = useState<Ong[]>([]);
  const [selectedOngId, setSelectedOngId] = useState<number | string>('');
  const [projects, setProjects] = useState<ShowProject[]>([]);
  const [compromises, setCompromises] = useState<Compromise[]>([]);
  const [allOngsMap, setAllOngsMap] = useState<Map<number, string>>(new Map());
  
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // --- Estados para Modal y Alertas ---
  const [selectionData, setSelectionData] = useState<SelectionData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { alert, showAlert, closeAlert } = useAlert();

  // --- Carga Inicial ---
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [userOngs, allOngs] = await Promise.all([
            api.getMyOngs(),
            api.getOngs()
        ]);
        setMyOngs(userOngs);
        
        if (userOngs.length > 0) {
            setSelectedOngId(userOngs[0].id);
        }
        
        const map = new Map<number, string>();
        allOngs.forEach((o: any) => map.set(o.id, o.name));
        setAllOngsMap(map);
        
      } catch (error) {
        console.error("Error cargando ONGs:", error);
        showAlert('error', 'Error al cargar datos iniciales');
      }
    };
    fetchInitialData();
  }, []);

  // --- Función reutilizable para cargar datos  ---
  const loadProjectsAndCompromises = async (ongId: number) => {
    setLoading(true);
    try {
      const [projectsData, compromisesData] = await Promise.all([
        api.getProjectsWithRequests(ongId),
        api.viewCompromises()
      ]);

      setProjects(projectsData);
      setCompromises(compromisesData);
    } catch (error) {
      console.error("Error fetching projects/compromises:", error);
      showAlert('error', 'Error al cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  // --- Efecto al cambiar ONG ---
  useEffect(() => {
    if (!selectedOngId) {
        setProjects([]);
        return;
    }
    loadProjectsAndCompromises(Number(selectedOngId));
    setCurrentPage(1);
  }, [selectedOngId]);

  // --- Lógica de Negocio ---

  const handleInitiateSelection = (task: Task, projectId: number, projectName: string, candidateOngId: number) => {
    const ongName = allOngsMap.get(candidateOngId) || 'la ONG';
    setSelectionData({
      task,
      projectId,
      projectName, 
      ongId: candidateOngId,
      ongName
    });
    setShowModal(true);
  };

  const handleConfirmSelection = async () => {
    if (!selectionData) return;
    
    setIsSubmitting(true);
    try {
        const localProject = await api.getLocalProjectByName(selectionData.projectName);
        
        if (!localProject || !localProject.id) {
            throw new Error('No se pudo sincronizar con el proyecto local.');
        }

        await api.selectOngForTask(selectionData.task.id, selectionData.ongId, localProject.id);        
        await loadProjectsAndCompromises(Number(selectedOngId));
        
        showAlert('success', `¡La ONG ${selectionData.ongName} ha sido seleccionada con éxito!`);
        setShowModal(false);
        setSelectionData(null);
        setTimeout(() => {
          window.location.reload();
          }, 1500);

    } catch (error: any) {
        console.error(error);
        showAlert('error', error.message || "Error al seleccionar la ONG");
    } finally {
        setIsSubmitting(false);
    }
  };

  const getTaskCompromises = (taskId: number) => {
    return compromises.filter(c => c.task_id === taskId);
  };

  // --- Helpers de Estilo ---
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
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.default}`}>
        {labels[status] || labels.default}
      </span>
    );
  };

  const getTaskStatusBadge = (status: string) => {
    const styles: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800",
      resolved: "bg-green-100 text-green-800",
      default: "bg-gray-100 text-gray-800"
    };
    const labels: { [key: string]: string } = {
      pending: "Pendiente",
      resolved: "Resuelta",
      default: status
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.default}`}>
        {labels[status] || labels.default}
      </span>
    );
  };

  const getCompromiseBadge = (status: string) => {
     const styles: { [key: string]: string } = {
      interested: "bg-blue-100 text-blue-800",
      selected: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      default: "bg-gray-100 text-gray-600"
    };
    const labels: { [key: string]: string } = {
      interested: "Interesado",
      selected: "Seleccionado",
      rejected: "Rechazado",
      default: status
    };
     return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${styles[status] || styles.default}`}>
        {labels[status] || labels.default}
      </span>
    );
  };

  // --- Paginación ---
  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProjects = projects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="w-full">
       {/* Componente de Alerta Global */}
       {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={closeAlert}
        />
      )}

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Elegir Pedido
            </h1>
            <p className="text-lg text-gray-600">
              Gestiona las postulaciones de otras ONGs a tus proyectos.
            </p>
          </div>
          
          <div className="min-w-[300px]">
             <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecciona tu ONG Organizadora
            </label>
            <div className="relative">
                <select
                    value={selectedOngId}
                    onChange={(e) => setSelectedOngId(e.target.value)}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white appearance-none shadow-sm text-gray-700 font-medium cursor-pointer hover:border-violet-300 transition-colors"
                >
                    <option value="">-- Seleccionar ONG --</option>
                    {myOngs.map(ong => (
                        <option key={ong.id} value={ong.id}>{ong.name}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
         <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">⏳</div>
              <div className="text-xl text-violet-600 font-semibold">Cargando proyectos...</div>
            </div>
         </div>
      ) : !selectedOngId ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
             <div className="text-6xl mb-4">👆</div>
             <h3 className="text-xl font-semibold text-gray-900">Selecciona una ONG para comenzar</h3>
          </div>
      ) : projects.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
             <div className="text-6xl mb-4">📭</div>
             <h3 className="text-xl font-semibold text-gray-900">No hay solicitudes pendientes para esta ONG.</h3>
             <p className="text-gray-500 mt-2">Los proyectos aparecerán aquí cuando otra ONG se postule para colaborar.</p>
          </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Proyecto</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Descripción</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Fecha Inicio</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tareas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentProjects.map((project) => (
                  <React.Fragment key={project.id}>
                    <tr 
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${expandedProjectId === project.id ? 'bg-gray-50' : ''}`}
                      onClick={() => setExpandedProjectId(expandedProjectId === project.id ? null : project.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{project.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 max-w-xs truncate">{project.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{project.start_date}</span>
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

                    {expandedProjectId === project.id && (
                      <tr className="bg-violet-50 animate-fadeIn">
                        <td colSpan={5} className="p-0">
                          <div className="p-4 md:p-6">
                            <h4 className="text-base font-semibold text-violet-900 mb-3 flex items-center gap-2">
                              <span>📋</span> Gestión de Tareas y Postulantes
                            </h4>
                            
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                              <table className="w-full">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-1/4">Tarea</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-1/4">Necesidad</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-1/6">Estado Tarea</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Postulaciones</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {project.tasks.map((task) => {
                                    const taskCompromises = getTaskCompromises(task.id);

                                    return (
                                      <tr key={task.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 align-top">
                                          <div className="font-medium text-gray-900">{task.title}</div>
                                          <div className="text-xs text-gray-500 mt-1">Cant: {task.quantity}</div>
                                        </td>
                                        <td className="px-4 py-4 align-top text-sm text-gray-600">
                                          {task.necessity}
                                        </td>
                                        <td className="px-4 py-4 align-top">
                                          {getTaskStatusBadge(task.status)}
                                        </td>
                                        <td className="px-4 py-4 align-top">
                                          {taskCompromises.length === 0 ? (
                                            <span className="text-xs text-gray-400 italic">Sin postulantes</span>
                                          ) : (
                                            <div className="space-y-2">
                                              {taskCompromises.map((comp, idx) => (
                                                <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-100">
                                                  <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-800">
                                                       {allOngsMap.get(comp.ong_id) || `ONG #${comp.ong_id}`}
                                                    </span>
                                                    <div className="mt-0.5">{getCompromiseBadge(comp.status)}</div>
                                                  </div>
                                                  
                                                  {comp.status === 'interested' && task.status !== 'resolved' && (
                                                    <button
                                                      // Pasa el project.name aquí
                                                      onClick={() => handleInitiateSelection(task, project.id, project.name, comp.ong_id)}
                                                      className="ml-3 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded shadow-sm transition-colors flex items-center gap-1"
                                                      title="Aceptar esta ONG"
                                                    >
                                                      <span>✅</span> Aceptar
                                                    </button>
                                                  )}
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
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

          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Mostrando {startIndex + 1} a {Math.min(startIndex + ITEMS_PER_PAGE, projects.length)} de {projects.length} proyectos
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
                   {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                          currentPage === page
                            ? 'bg-violet-600 text-white shadow-md'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
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
          )}
        </div>
      )}

      {/* === MODAL DE CONFIRMACIÓN === */}
      {showModal && selectionData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in border border-gray-100">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Confirmar Selección</h3>
              <p className="text-sm text-gray-500 mt-2">
                Estás a punto de asignar una tarea a una organización colaboradora.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200 text-left">
                <div className="mb-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tarea</p>
                    <p className="text-gray-900 font-medium">{selectionData.task.title}</p>
                </div>
                <div className="mb-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Organización Seleccionada</p>
                    <p className="text-gray-900 font-medium text-lg text-violet-700">{selectionData.ongName}</p>
                </div>
                 <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Acción</p>
                    <p className="text-xs text-gray-600">Al confirmar, se notificará a la organización y se rechazarán las demás postulaciones para esta tarea.</p>
                </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                    setShowModal(false);
                    setSelectionData(null);
                }}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSelection}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-md transition-colors flex justify-center items-center"
              >
                {isSubmitting ? (
                    <>
                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     Procesando...
                    </>
                ) : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectRequest;