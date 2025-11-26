import React, { useEffect, useState } from 'react';
import { api } from '../api/api';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Alert, useAlert } from '../components/ui/Alert';

const COLORS = ['#8b5cf6', '#e5e7eb']; // Violeta y Gris para el Pie

const Metrics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  
  // Estados para las métricas
  const [successfulAvg, setSuccessfulAvg] = useState<number>(0);
  const [pieData, setPieData] = useState<any[]>([]);
  const [topOngsData, setTopOngsData] = useState<any[]>([]);

  const { alert, showAlert, closeAlert } = useAlert();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          avgData,
          collabData,
          localTasks,
          cloudCollabs
        ] = await Promise.all([
          api.getSuccessfulOnTimeAvg(),
          api.getPercentNoCollaboration(),
          api.getOngsAndTasks(),
          api.getOngsAndCollaborations()
        ]);

        // 1. Procesar Average
        setSuccessfulAvg(avgData);

        // 2. Procesar Pie Chart (Sin Colab vs Con Colab)
        const noCollab = collabData.projects_no_collab;
        const total = collabData.total_projects;
        const withCollab = total - noCollab;
        
        setPieData([
          { name: 'Sin Colaboración Externa', value: noCollab },
          { name: 'Con Colaboración', value: withCollab }
        ]);

        // 3. Procesar Top 3 (Merge Local + Cloud)
        const combinedStats: Record<string, number> = {};

        // Sumar tareas resueltas (Local)
        localTasks.forEach((item: any) => {
          const name = item.ong_name;
          const count = item.resolved_tasks || 0;
          combinedStats[name] = (combinedStats[name] || 0) + count;
        });

        // Sumar colaboraciones (Cloud)
        cloudCollabs.forEach((item: any) => {
          const name = item.ong_name;
          const count = item.collaborations || 0;
          combinedStats[name] = (combinedStats[name] || 0) + count;
        });

        // Convertir a array, ordenar y tomar Top 3
        const sortedTop3 = Object.entries(combinedStats)
          .map(([name, total]) => ({ name, total }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 3);

        setTopOngsData(sortedTop3);

      } catch (error) {
        console.error("Error cargando métricas:", error);
        showAlert('error', 'Error al cargar las métricas. Asegúrate de tener los permisos necesarios.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📊</div>
          <div className="text-xl text-violet-600 font-semibold">Calculando métricas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {alert.show && <Alert type={alert.type} message={alert.message} onClose={closeAlert} />}

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-l-4 border-violet-500">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Métricas</h1>
        <p className="text-lg text-gray-600">Indicadores clave de rendimiento de los proyectos y las ONGs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Métrica 1: Porcentaje de Éxito en Tiempo */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Proyectos Exitosos a Tiempo</h3>
          <div className="relative flex items-center justify-center w-48 h-48 rounded-full bg-violet-50 border-8 border-violet-200">
            <span className="text-4xl font-bold text-violet-700">
              {successfulAvg.toFixed(1)}%
            </span>
          </div>
          <p className="mt-4 text-sm text-gray-500">Promedio de proyectos finalizados en fecha o antes.</p>
        </div>

        {/* Métrica 2: Gráfico de Torta (Colaboración) */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Autonomía de Proyectos</h3>
          <p className="text-sm text-gray-500 mb-4">Proyectos resueltos sin pedir ayuda externa</p>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Métrica 3: Top 3 ONGs (Bar Chart) */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 md:col-span-2">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Top 3 ONGs Más Activas</h3>
          <p className="text-sm text-gray-500 mb-6">Suma de tareas propias resueltas + colaboraciones externas</p>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topOngsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fill: '#4b5563'}} />
                <YAxis tick={{fill: '#4b5563'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  cursor={{fill: '#f3f4f6'}}
                />
                <Bar dataKey="total" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Total Tareas/Colaboraciones" barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Metrics;