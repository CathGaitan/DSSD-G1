import React, { useState, useEffect } from "react";

interface Ong {
  id: number;
  name: string;
}

const CreateProjectForm: React.FC = () => {
  const [step, setStep] = useState(1); // 1 = proyecto, 2 = tareas
  const [ongs, setOngs] = useState<Ong[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    owner_id: "",
    status: "active",
  });

  const [dateError, setDateError] = useState("");
  const [tasks, setTasks] = useState([
    { title: "", necessity: "", start_date: "", end_date: "", resolves_by_itself: false },
  ]);
  const [taskErrors, setTaskErrors] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/ongs/")
      .then((response) => response.json())
      .then((data) => setOngs(data))
      .catch((error) => console.error("Error fetching ONGs:", error));
  }, []);

  // --- Manejo del form proyecto ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    if (name === "start_date" || name === "end_date") {
      const start = new Date(newFormData.start_date);
      const end = new Date(newFormData.end_date);

      if (newFormData.start_date && newFormData.end_date && end < start) {
        setDateError("❌ La fecha de finalización no puede ser anterior a la de inicio.");
      } else {
        setDateError("");
      }
    }
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dateError) return alert("Corrige las fechas antes de continuar.");
    setStep(2); // paso a tareas
  };

  // --- Manejo de tareas ---
  const handleTaskChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const updatedTasks = [...tasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    };
    setTasks(updatedTasks);
  };

  const addTask = () => {
    setTasks([...tasks, { title: "", necessity: "", start_date: "", end_date: "", resolves_by_itself: false }]);
    setTaskErrors([...taskErrors, ""]);
  };

  const removeTask = (index: number) => {
    if (tasks.length > 1) {
      const updatedTasks = tasks.filter((_, i) => i !== index);
      const updatedErrors = taskErrors.filter((_, i) => i !== index);
      setTasks(updatedTasks);
      setTaskErrors(updatedErrors);
    }
  };

  // --- Submit final ---
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      tasks: tasks,
    };

    try {
      setLoading(true);
      console.log("Payload enviado:", payload);
      const response = await fetch("http://localhost:8000/projects/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo crear el proyecto`);
      }

      const data = await response.json();
      alert("✅ Proyecto y tareas creados con éxito!");
      console.log("Proyecto creado:", data);

      // reset
      setFormData({ name: "", description: "", start_date: "", end_date: "", owner_id: "", status: "active" });
      setTasks([{ title: "", necessity: "", start_date: "", end_date: "", resolves_by_itself: false }]);
      setStep(1);
    } catch (error) {
      console.error("Error creando el proyecto:", error);
      alert("❌ Hubo un error al crear el proyecto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-white shadow-md rounded-lg border border-gray-200">
      {/* --- Paso 1: Proyecto --- */}
      {step === 1 && (
        <form onSubmit={handleProjectSubmit} className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-blue-700">📑 Información del Proyecto</h2>

          <div>
            <label className="block text-gray-700">Nombre del Proyecto</label>
            <input
              type="text"
              name="name"
              placeholder="Ej: Construcción de un Centro Comunitario en Barrio Altos de San Lorenzo"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-gray-700">Descripción</label>
            <textarea
              name="description"
              placeholder="Describe brevemente el proyecto..."
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Fecha de Inicio</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700">Fecha de Finalización</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
                className={`w-full border rounded px-3 py-2 ${dateError ? "border-red-500" : ""}`}
              />
              {dateError && <p className="text-red-500 text-sm">{dateError}</p>}
            </div>
          </div>

          <div>
            <label className="block text-gray-700">ONG Responsable</label>
            <select
              name="owner_id"
              value={formData.owner_id}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Seleccione una ONG</option>
              {ongs.map((ong) => (
                <option key={ong.id} value={ong.id}>
                  {ong.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={!!dateError}
            className="bg-yellow-400 text-white px-4 py-2 rounded"
          >
            Siguiente: Agregar Tareas
          </button>
        </form>
      )}

      {/* --- Paso 2: Tareas --- */}
      {step === 2 && (
        <form onSubmit={handleFinalSubmit} className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-blue-700">📝 Tareas del Proyecto</h2>

          {tasks.map((task, index) => (
            <div key={index} className="border p-4 rounded space-y-2">
              <input
                type="text"
                name="title"
                placeholder="Título de la tarea"
                value={task.title}
                onChange={(e) => handleTaskChange(index, e)}
                required
                className="w-full border rounded px-3 py-2"
              />

              <textarea
                name="necessity"
                placeholder="Necesidad (especifica qué se necesita para esta tarea)"
                value={task.necessity}
                onChange={(e) => handleTaskChange(index, e)}
                required
                className="w-full border rounded px-3 py-2"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  name="start_date"
                  value={task.start_date}
                  onChange={(e) => handleTaskChange(index, e)}
                  required
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="date"
                  name="end_date"
                  value={task.end_date}
                  onChange={(e) => handleTaskChange(index, e)}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="resolves_by_itself"
                  checked={task.resolves_by_itself}
                  onChange={(e) => handleTaskChange(index, e)}
                />
                ¿Se resuelve por la ONG Responsable?
              </label>

              {tasks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTask(index)}
                  className="text-red-500 text-sm"
                >
                  Eliminar tarea
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addTask}
            className="bg-blue-400 text-white px-3 py-1 rounded"
          >
            ➕ Agregar otra tarea
          </button>

          <div className="flex justify-between">
            <button type="button" onClick={() => setStep(1)} className="text-gray-500">
              ⬅ Volver
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {loading ? "Creando..." : "✅ Crear Proyecto con Tareas"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateProjectForm;
