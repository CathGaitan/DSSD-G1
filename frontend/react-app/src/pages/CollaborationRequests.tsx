// Path: frontend/react-app/src/pages/CollaborationRequests.tsx
// Este componente muestra la vista de pedidos de colaboración
// Para integrarlo:
// 1. Guarda este archivo en: src/pages/CollaborationRequests.tsx
// 2. Agrega la ruta en App.tsx: <Route path="/collaboration-requests" element={<CollaborationRequests />} />
// 3. Agrega el enlace en Header.tsx en el array navItems: { path: '/collaboration-requests', label: 'Pedidos', icon: '📋' }

import React, { useState } from 'react';

// Tipos de datos
interface CollaborationRequest {
  id: number;
  projectName: string;
  description: string;
  quantity: string;
  organizerONG: string;
  createdDate: string;
  endDate: string;
  status: 'pendiente' | 'comprometido' | 'cumplido';
  committedBy?: string;
  commitDate?: string;
}

interface UserOrganization {
  id: number;
  name: string;
}

// Datos de ejemplo - Organizaciones del usuario
const userOrganizations: UserOrganization[] = [
  { id: 1, name: "Fundación Esperanza" },
  { id: 2, name: "ONG Agua Limpia" },
  { id: 3, name: "Farmacia Social" },
  { id: 4, name: "Tech para Todos" },
  { id: 5, name: "Comunidad Solidaria" }
];

// Datos de ejemplo - Pedidos
const mockRequests: CollaborationRequest[] = [
  {
    id: 1,
    projectName: "Programa de Educación Rural",
    description: "Útiles escolares para 50 niños",
    quantity: "50 kits",
    organizerONG: "ONG Educación para Todos",
    createdDate: "2025-10-01",
    endDate: "2025-10-30",
    status: "cumplido",
    committedBy: "Fundación Esperanza",
    commitDate: "2025-10-05"
  },
  {
    id: 2,
    projectName: "Acceso a Agua Potable",
    description: "Fondos para instalación de bomba de agua",
    quantity: "$50,000",
    organizerONG: "Asociación Agua Vida",
    createdDate: "2025-10-03",
    endDate: "2025-11-15",
    status: "comprometido",
    committedBy: "ONG Agua Limpia",
    commitDate: "2025-10-10"
  },
  {
    id: 3,
    projectName: "Construcción de Viviendas",
    description: "Albañiles para construcción",
    quantity: "5 personas x 3 días",
    organizerONG: "Techo para Todos",
    createdDate: "2025-10-05",
    endDate: "2025-10-25",
    status: "pendiente"
  },
  {
    id: 4,
    projectName: "Huertas Comunitarias",
    description: "Semillas y herramientas de jardinería",
    quantity: "100 paquetes de semillas",
    organizerONG: "Verde Urbano",
    createdDate: "2025-10-08",
    endDate: "2025-11-01",
    status: "pendiente"
  },
  {
    id: 5,
    projectName: "Centro de Salud Comunitario",
    description: "Medicamentos básicos",
    quantity: "$30,000",
    organizerONG: "Salud Comunitaria",
    createdDate: "2025-10-10",
    endDate: "2025-10-31",
    status: "comprometido",
    committedBy: "Farmacia Social",
    commitDate: "2025-10-12"
  },
  {
    id: 6,
    projectName: "Biblioteca Móvil",
    description: "Libros infantiles y juveniles",
    quantity: "200 libros",
    organizerONG: "Lectura para Todos",
    createdDate: "2025-10-12",
    endDate: "2025-11-20",
    status: "pendiente"
  },
  {
    id: 7,
    projectName: "Comedor Comunitario",
    description: "Cocineros voluntarios",
    quantity: "3 personas x 5 días",
    organizerONG: "Alimentación Solidaria",
    createdDate: "2025-10-13",
    endDate: "2025-10-28",
    status: "pendiente"
  },
  {
    id: 8,
    projectName: "Taller de Capacitación",
    description: "Computadoras para capacitación",
    quantity: "10 equipos",
    organizerONG: "Capacitación Digital",
    createdDate: "2025-10-14",
    endDate: "2025-11-10",
    status: "cumplido",
    committedBy: "Tech para Todos",
    commitDate: "2025-10-15"
  }
];

const CollaborationRequestsView: React.FC = () => {
  const [requests, setRequests] = useState<CollaborationRequest[]>(mockRequests);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [selectedRequest, setSelectedRequest] = useState<CollaborationRequest | null>(null);
  const [showCommitModal, setShowCommitModal] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  
  const itemsPerPage = 5;

  // Color según estado
  const getStatusBadge = (status: string) => {
    const styles = {
      pendiente: "bg-yellow-100 text-yellow-800",
      comprometido: "bg-blue-100 text-blue-800",
      cumplido: "bg-green-100 text-green-800"
    };
    const labels = {
      pendiente: "Pendiente",
      comprometido: "Comprometido",
      cumplido: "Cumplido"
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

  const confirmCommit = () => {
    if (selectedRequest && selectedOrgId) {
      const selectedOrg = userOrganizations.find(org => org.id === selectedOrgId);
      if (selectedOrg) {
        setRequests(requests.map(req => 
          req.id === selectedRequest.id 
            ? { 
                ...req, 
                status: 'comprometido', 
                committedBy: selectedOrg.name,
                commitDate: new Date().toISOString().split('T')[0]
              }
            : req
        ));
        setShowCommitModal(false);
        setSelectedOrgId(null);
        setSelectedRequest(null);
      }
    }
  };

  // Marcar como cumplido
  const markAsFulfilled = (id: number) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'cumplido' } : req
    ));
  };

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
              <option value="pendiente">Pendiente</option>
              <option value="comprometido">Comprometido</option>
              <option value="cumplido">Cumplido</option>
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
                <th className="px-6 py-4 text-left text-sm font-semibold">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Acciones</th>
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
                    <span className="text-sm font-medium text-violet-700">{request.organizerONG}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{request.endDate}</span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {request.status === 'pendiente' && (
                        <button
                          onClick={() => handleCommit(request)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                        >
                          🤝 Comprometer
                        </button>
                      )}
                      {request.status === 'comprometido' && (
                        <button
                          onClick={() => markAsFulfilled(request.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                        >
                          ✅ Cumplido
                        </button>
                      )}
                      {request.status === 'cumplido' && (
                        <span className="px-4 py-2 text-green-600 text-sm font-medium">
                          ✓ Completado
                        </span>
                      )}
                    </div>
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

      {/* Modal para Comprometer Ayuda */}
      {showCommitModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-fadeIn">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🤝 Comprometer Ayuda
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
                {userOrganizations.map(org => (
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
          <div className="text-6xl mb-4">🔍</div>
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