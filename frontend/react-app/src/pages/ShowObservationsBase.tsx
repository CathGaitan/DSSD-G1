import React, { useEffect, useState } from 'react';
import type { Observation } from '../types/observation.types';

interface ColumnConfig {
  header: string;
  render: (obs: Observation) => React.ReactNode;
  width?: string;
}

interface ShowObservationsBaseProps {
  title: string;
  subtitle: string;
  fetchData: () => Promise<any[]>;
  extraColumns?: ColumnConfig[];
}

export const ShowObservationsBase: React.FC<ShowObservationsBaseProps> = ({
  title,
  subtitle,
  fetchData,
  extraColumns = []
}) => {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchData();
      setObservations(data);
    } catch (err) {
      setError("Error al cargar las observaciones.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⏳</div>
          <div className="text-xl text-violet-600 font-semibold">Cargando observaciones...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-l-4 border-violet-500">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <span>📨</span> {title}
        </h1>
        <p className="text-lg text-gray-600">{subtitle}</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Proyecto</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider w-1/3">Comentario</th>
                {extraColumns.map((col, idx) => (
                  <th key={idx} className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${col.width || ''}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {observations.length === 0 ? (
                <tr>
                  <td colSpan={4 + extraColumns.length} className="px-6 py-12 text-center text-gray-500">
                    <div className="text-4xl mb-2">📭</div>
                    No hay observaciones para mostrar.
                  </td>
                </tr>
              ) : (
                observations.map((obs) => (
                  <tr key={obs.id} className="hover:bg-gray-50 transition-colors">
                    {/* Columna: Proyecto */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{obs.project_name}</div>
                    </td>
                    
                    {/* Columna: Fecha */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {new Date(obs.created_at).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Columna: Estado (Nueva) */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        obs.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {obs.status}
                      </span>
                    </td>

                    {/* Columna: Comentario */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 italic">
                        "{obs.content}"
                      </div>
                    </td>

                    {/* Renderizar celdas de columnas extra */}
                    {extraColumns.map((col, idx) => (
                      <td key={idx} className="px-6 py-4 align-middle">
                        {col.render(obs)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};