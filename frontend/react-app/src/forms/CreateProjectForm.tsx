import React, { useState, useEffect } from 'react';
import { StepIndicator } from '../components/project/StepIndicator';
import { ProjectForm } from '../components/project/ProjectForm';
import { TasksForm } from '../components/project/TasksForm';
import { Alert, useAlert } from '../components/ui/Alert';
import type { Ong, Task, ProjectFormData } from '../types/project.types';

const CreateProjectForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [ongs, setOngs] = useState<Ong[]>([]);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    owner_id: 0,
    status: 'active',
  });
  const [dateError, setDateError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    owner_id: '',
  });
  const [tasks, setTasks] = useState<Task[]>([
    { title: '', necessity: '', start_date: '', end_date: '', resolves_by_itself: false },
  ]);
  const [loading, setLoading] = useState(false);
  
  // Hook para las alertas
  const { alert, showAlert, closeAlert } = useAlert();

  useEffect(() => {
    fetch('http://localhost:8000/ongs/')
      .then((response) => response.json())
      .then((data) => setOngs(data))
      .catch((error) => {
        console.error('Error fetching ONGs:', error);
        showAlert('error', 'Error al cargar las ONGs');
      });
  }, []);

  const validateDates = (start: string, end: string) => {
    if (start && end && new Date(end) < new Date(start)) {
      setDateError('La fecha de finalización no puede ser anterior a la de inicio.');
    } else {
      setDateError('');
    }
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'El nombre del proyecto es obligatorio';
        } else if (value.trim().length < 3) {
          error = 'El nombre debe tener al menos 3 caracteres';
        }
        break;
      case 'description':
        if (!value.trim()) {
          error = 'La descripción es obligatoria';
        } else if (value.trim().length < 15) {
          error = 'La descripción debe tener al menos 15 caracteres';
        }
        break;
      case 'start_date':
        if (!value) {
          error = 'La fecha de inicio es obligatoria';
        }
        break;
      case 'end_date':
        if (!value) {
          error = 'La fecha de finalización es obligatoria';
        }
        break;
      case 'owner_id':
        if (!value) {
          error = 'Debes seleccionar una ONG';
        }
        break;
    }
    
    setFieldErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const validateAllFields = () => {
    const errors = {
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      owner_id: '',
    };
    
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'El nombre del proyecto es obligatorio';
      isValid = false;
    } else if (formData.name.trim().length < 3) {
      errors.name = 'El nombre debe tener al menos 3 caracteres';
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = 'La descripción es obligatoria';
      isValid = false;
    } else if (formData.description.trim().length < 15) {
      errors.description = 'La descripción debe tener al menos 15 caracteres';
      isValid = false;
    }

    if (!formData.start_date) {
      errors.start_date = 'La fecha de inicio es obligatoria';
      isValid = false;
    }

    if (!formData.end_date) {
      errors.end_date = 'La fecha de finalización es obligatoria';
      isValid = false;
    }

    if (!formData.owner_id) {
      errors.owner_id = 'Debes seleccionar una ONG';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    // Validar el campo mientras se escribe
    validateField(name, value);

    if (name === 'start_date' || name === 'end_date') {
      validateDates(newFormData.start_date, newFormData.end_date);
    }
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos
    const isValid = validateAllFields();
    
    if (!isValid) {
      showAlert('warning', 'Por favor completa todos los campos obligatorios correctamente.');
      return;
    }
    
    if (dateError) {
      showAlert('warning', 'Corrige las fechas antes de continuar.');
      return;
    }
    
    setStep(2);
  };

  // --- Manejo de tareas ---
  const handleTaskChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const updatedTasks = [...tasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    };
    setTasks(updatedTasks);
  };

  const addTask = () => {
    setTasks([...tasks, { title: '', necessity: '', start_date: '', end_date: '', resolves_by_itself: false }]);
  };

  const removeTask = (index: number) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter((_, i) => i !== index));
    }
  };

  // --- Submit final ---
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      // Convertir owner_id a int antes de enviar
      const payload = { ...formData, owner_id: parseInt(formData.owner_id as string, 10), tasks };
      console.log(JSON.stringify(payload));
      const response = await fetch('http://localhost:8000/projects/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log(response);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo crear el proyecto`);
      }

      const data = await response.json();
      showAlert('success', 'Proyecto y tareas creados con éxito!');
      console.log('Proyecto creado:', data);

      // Reset
      setFormData({ name: '', description: '', start_date: '', end_date: '', owner_id: '', status: 'active' });
      setTasks([{ title: '', necessity: '', start_date: '', end_date: '', resolves_by_itself: false }]);
      setFieldErrors({ name: '', description: '', start_date: '', end_date: '', owner_id: '' });
      setStep(1);
    } catch (error) {
      console.error('Error creando el proyecto:', error);
      showAlert('error', 'Hubo un error al crear el proyecto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Componente de alerta */}
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={closeAlert}
        />
      )}
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-2xl rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            <StepIndicator currentStep={step} totalSteps={2} />

            {step === 1 ? (
              <ProjectForm
                formData={formData}
                ongs={ongs}
                dateError={dateError}
                fieldErrors={fieldErrors}
                onSubmit={handleProjectSubmit}
                onChange={handleChange}
              />
            ) : (
              <TasksForm
                tasks={tasks}
                loading={loading}
                onSubmit={handleFinalSubmit}
                onBack={() => setStep(1)}
                onTaskChange={handleTaskChange}
                onAddTask={addTask}
                onRemoveTask={removeTask}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectForm;