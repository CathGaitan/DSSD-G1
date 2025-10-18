import React, { useState, useEffect } from 'react';
import { api } from '../api/api';
import { type ShowProject } from '../types/project.types';
import { type Ong } from '../types/ong.types';

interface CollaborationRequest {
  id: number;
  projectName: string;
  description: string;
  quantity: string;
  organizerONG: string;
  createdDate: string;
  endDate: string;
  status: 'activo' | 'completado';
  committedBy?: string;
  commitDate?: string;
}

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
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [selectedRequest, setSelectedRequest] = useState<CollaborationRequest | null>(null);
  const [showCommitModal, setShowCommitModal] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ongInfoData, setOngInfoData] = useState<Ong[]>([]);

  const itemsPerPage = 5;

  // Convertir datos de API a formato de tabla
  const transformProjectsToRequests = (projects: ShowProject[]): CollaborationRequest[] => {
    const requests: CollaborationRequest[] = [];
    
    projects.forEach(project => {
      // Validar que tasks exista y sea un array
      if (project.tasks && Array.isArray(project.tasks)) {
        project.tasks.forEach((task, taskIndex) => {
          requests.push({
            id: `${project.id}-${taskIndex}` as any,
            projectName: project.name,
            description: task.necessity,
            quantity: task.quantity,
            organizerONG: project.owner_id.toString(),
            createdDate: project.start_date,
            endDate: task.end_date,
            status: mapProjectStatusToRequestStatus(project.status),
            committedBy: undefined,
            commitDate: undefined
          });
        });
      }
    });
    
    return requests;
  };

  // Mapear estado del proyecto al estado del request
  const mapProjectStatusToRequestStatus = (status: string): 'activo' | 'completado' => {
    switch(status) {
      case 'active':
        return 'activo';
      case 'completed':
        return 'completado';
      default:
        return 'activo';
    }
  };

  // Cargar datos desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const projectsPromise = fetchProjects();
        const ongsPromise = (showCommitActions || showOrganizerColumn) ? api.getOngs() : Promise.resolve([]);
        
        const [projectsData, ongsData] = await Promise.all([
          projectsPromise,
          ongsPromise
        ]);
        
        const transformedRequests = transformProjectsToRequests(projectsData);
        setRequests(transformedRequests);
        setOngInfoData(ongsData);
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchProjects, showCommitActions, showOrganizerColumn]);

  // Color según estado
  const getStatusBadge = (status: string) => {
    const styles = {
      activo: "bg-blue-100 text-blue-800",
      completado: "bg-green-100 text-green-800"
    };
    const labels = {
      activo: "Activo",
      completado: "Completado"
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  // Filtrar pedidos
  const filteredRequests = requests.filter(req => {
    const statusMatch = filterStatus === 'todos' || req.status === filterStatus;
    return statusMatch;
  });

  // Paginación
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, endIndex);

  // Comprometer ayuda
  const handleCommit = (request: CollaborationRequest) => {
    setSelectedRequest(request);
    setShowCommitModal(true);
  };

  const confirmCommit = async () => {
    if (selectedRequest && selectedOrgId) {
      try {
        const taskId = selectedRequest.id.toString().split('-')[0];
        await api.commitTaskToOng(Number(taskId), selectedOrgId);
        
        setShowCommitModal(false);
        setSelectedOrgId(null);
        setSelectedRequest(null);
        
        const projectsData = await fetchProjects();
        const transformedRequests = transformProjectsToRequests(projectsData);
        setRequests(transformedRequests);
        
      } catch (error) {
        console.error('Error al comprometer la ayuda:', error);
        alert('Error al guardar el compromiso. Intenta de nuevo.');
      }
    }
  };

  // Obtener nombre de ONG por ID
  const getONGName = (ongId: string): string => {
    const org = ongInfoData.find(o => o.id === Number(ongId));
    return org ? org.name : `ONG #${ongId}`;
  };

  // Mostrar loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <div className="text-xl text-violet-600 font-semibold">Cargando pedidos...</div>
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
            <h3 className="font-bold">Error al cargar los pedidos</h3>
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
      {/* Header */}
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
            <div className="text-3xl font-bold text-violet-600">{filteredRequests.length}</div>
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
              <option value="activo">Activo</option>
              <option value="completado">Completado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Pedidos */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Proyecto</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Descripción</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Cantidad</th>
                {showOrganizerColumn && (
                  <th className="px-6 py-4 text-left text-sm font-semibold">ONG Organizadora</th>
                )}
                <th className="px-6 py-4 text-left text-sm font-semibold">Fecha Término</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Estado del proyecto</th>
                {showCommitActions && (
                  <th className="px-6 py-4 text-left text-sm font-semibold">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{request.projectName}</div>
                    <div className="text-xs text-gray-500">Creado: {request.createdDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 max-w-xs">{request.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{request.quantity}</span>
                  </td>
                  {showOrganizerColumn && (
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-violet-700">{getONGName(request.organizerONG)}</span>
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{request.endDate}</span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(request.status)}
                  </td>
                  {showCommitActions && (
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {!request.committedBy && (
                          <button
                            onClick={() => handleCommit(request)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                          >
                            Comprometer
                          </button>
                        )}
                        {request.committedBy && (
                          <span className="px-4 py-2 text-blue-600 text-sm font-medium">
                            ✓ Comprometido por {request.committedBy}
                          </span>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredRequests.length)} de {filteredRequests.length} pedidos
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
      {showCommitActions && showCommitModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-fadeIn">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Comprometer Ayuda
            </h3>
            <div className="mb-6">
              <div className="bg-violet-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-violet-900 mb-1">Proyecto:</p>
                <p className="text-gray-700">{selectedRequest.projectName}</p>
                <p className="text-sm font-semibold text-violet-900 mb-1 mt-2">Pedido:</p>
                <p className="text-gray-700">{selectedRequest.description}</p>
                <p className="text-sm font-semibold text-violet-900 mb-1 mt-2">Cantidad:</p>
                <p className="text-gray-700">{selectedRequest.quantity}</p>
                <p className="text-sm font-semibold text-violet-900 mb-1 mt-2">Fecha Término:</p>
                <p className="text-gray-700">{selectedRequest.endDate}</p>
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
                {ongInfoData.map(org => (
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
                  setSelectedRequest(null);
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
      {currentRequests.length === 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center mt-8">
          <div className="text-6xl mb-4">🔭</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No se encontraron pedidos
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