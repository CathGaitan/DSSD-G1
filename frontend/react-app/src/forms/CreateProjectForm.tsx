import React, { useState, useEffect } from "react";



interface Ong {
  id: number;
  name: string;
}

const CreateProjectForm: React.FC = () => {
    const [ongs, setOngs] = useState<Ong[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        owner: '',
        status: 'active'
    });

    useEffect(() => {
        // Fetch ONG data from backend API
        fetch('http://localhost:8000/ongs/')
            .then(response => response.json())
            .then(data => setOngs(data))
            .catch(error => console.error('Error fetching ONGs:', error));
    }, []);

      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Nuevo Proyecto:", formData);
    alert("✅ Proyecto creado con éxito!");
    setFormData({ name: "", description: "", start_date: "", end_date: "", owner: "", status: "active" });
  };

  const handleReset = () => {
    setFormData({ name: "", description: "", start_date: "", end_date: "", owner: "", status: "active" });
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white shadow-md rounded-lg border border-gray-200">
      {/* Encabezado */}
      <div className="bg-blue-50 border-b border-gray-200 p-4 rounded-t-lg">
        <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
          📑 Información del Proyecto
        </h2>
        <p className="text-sm text-gray-600">
          Proporcione los detalles básicos del proyecto que desea crear
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Nombre del proyecto */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Nombre del Proyecto
          </label>
          <input
            type="text"
            name="name"
            placeholder="Ej: Programa de Educación Rural 2024"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Descripción
          </label>
          <textarea
            name="description"
            placeholder="Describa los objetivos, alcance y actividades principales del proyecto..."
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Fecha de Inicio
            </label>
            <input
              type="date"
              name="start_date"
              value={formData["start_date"]}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Fecha de Finalización
            </label>
            <input
              type="date"
              name="end_date"
              value={formData["end_date"]}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        </div>

        {/* ONG Responsable */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            ONG Responsable
          </label>
          <select
            name="owner"
            value={formData.owner}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Seleccione la ONG responsable</option>
            {ongs.map(ong => (
              <option key={ong.id} value={ong.id}>
                {ong.name}
              </option>
            ))}
          </select>
        </div>

        {/* Botones */}
        <div className="flex justify-between items-center pt-4 border-t">
          <button
            type="submit"
            className="bg-yellow-400 text-white font-medium px-4 py-2 rounded hover:bg-yellow-500 transition"
          >
            Crear Proyecto
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="border border-blue-500 text-blue-500 font-medium px-4 py-2 rounded hover:bg-blue-50 transition"
          >
            Limpiar Formulario
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreateProjectForm;

