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
}

const CollaborationRequestsView: React.FC = () => {
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ongInfoData, setOngInfoData] = useState<Ong[]>([]);

  const itemsPerPage = 5;

  // Convertir datos de API a formato de tabla
  const transformProjectsToRequests = (projects: ShowProject[]): CollaborationRequest[] => {
    const requests: CollaborationRequest[] = [];
    
    projects.forEach(project => {
      project.tasks.forEach((task, taskIndex) => {
        requests.push({
          id: `${project.id}-${taskIndex}` as any,
          projectName: project.name,
          description: task.necessity,
          quantity: task.quantity,
          organizerONG: project.owner_id.toString(),
          createdDate: project.start_date,
          endDate: task.end_date,
          status: mapProjectStatusToRequestStatus(project.status)
        });
      });
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
        
        const [projectsData, ongsData] = await Promise.all([
          api.getProjects(),
          api.getOngs()
        ]);
        
        console.log('Fetched projects:', projectsData);
        console.log('Fetched ONGs:', ongsData);
        
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
  }, []);

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
              📋 Pedidos de Colaboración
            </h1>
            <p className="text-lg text-gray-600">
              Gestiona y responde a las necesidades de los proyectos comunitarios
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-violet-600">{filteredRequests.length}</div>
            <div className="text-sm text-gray-500">pedidos activos</div>
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
                <th className="px-6 py-4 text-left text-sm font-semibold">ONG Organizadora</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Fecha Término</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Estado del proyecto</th>
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
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-violet-700">{getONGName(request.organizerONG)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{request.endDate}</span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(request.status)}
                  </td>
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

export default CollaborationRequestsView;