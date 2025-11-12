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
    { title: '', necessity: '', start_date: '', end_date: '', resolves_by_itself: false, quantity: '' },
  ]);
  const [tasksErrors, setTasksErrors] = useState<Array<{
    title: string;
    necessity: string;
    start_date: string;
    end_date: string;
    quantity: string;
  }>>([
    { title: '', necessity: '', start_date: '', end_date: '', quantity: '' },
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

  // --- Validación de tareas ---
  const validateTaskField = (index: number, name: string, value: string) => {
    let error = '';
    
    switch (name) {
      case 'title':
        if (!value.trim()) {
          error = 'El título de la tarea es obligatorio';
        } else if (value.trim().length < 3) {
          error = 'El título debe tener al menos 3 caracteres';
        }
        break;
      case 'necessity':
        if (!value.trim()) {
          error = 'La descripción es obligatoria';
        } else if (value.trim().length < 10) {
          error = 'La descripción debe tener al menos 10 caracteres';
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
      case 'quantity':
        if (!value.trim()) {
          error = 'La cantidad es obligatoria';
        }
        break;
    }
    
    const newTasksErrors = [...tasksErrors];
    newTasksErrors[index] = { ...newTasksErrors[index], [name]: error };
    setTasksErrors(newTasksErrors);
    
    return error === '';
  };

  const validateAllTasks = () => {
    const errors: Array<{
      title: string;
      necessity: string;
      start_date: string;
      end_date: string;
      quantity: string;
    }> = [];
    let isValid = true;

    tasks.forEach((task, index) => {
      const taskError = {
        title: '',
        necessity: '',
        start_date: '',
        end_date: '',
        quantity: '',
      };

      if (!task.title.trim()) {
        taskError.title = 'El título de la tarea es obligatorio';
        isValid = false;
      } else if (task.title.trim().length < 3) {
        taskError.title = 'El título debe tener al menos 3 caracteres';
        isValid = false;
      }

      if (!task.necessity.trim()) {
        taskError.necessity = 'La descripción es obligatoria';
        isValid = false;
      } else if (task.necessity.trim().length < 10) {
        taskError.necessity = 'La descripción debe tener al menos 10 caracteres';
        isValid = false;
      }

      if (!task.start_date) {
        taskError.start_date = 'La fecha de inicio es obligatoria';
        isValid = false;
      }

      if (!task.end_date) {
        taskError.end_date = 'La fecha de finalización es obligatoria';
        isValid = false;
      }

      if (!task.quantity.trim()) {
        taskError.quantity = 'La cantidad es obligatoria';
        isValid = false;
      }

      // Validar que la fecha de fin sea posterior a la de inicio
      if (task.start_date && task.end_date && new Date(task.end_date) < new Date(task.start_date)) {
        taskError.end_date = 'La fecha de fin debe ser posterior a la de inicio';
        isValid = false;
      }

      errors.push(taskError);
    });

    setTasksErrors(errors);
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

    // Validar el campo mientras se escribe
    if (name !== 'resolves_by_itself') {
      validateTaskField(index, name, value);
    }
  };

  const addTask = () => {
    setTasks([...tasks, { title: '', necessity: '', start_date: '', end_date: '', resolves_by_itself: false, quantity: '' }]);
    setTasksErrors([...tasksErrors, { title: '', necessity: '', start_date: '', end_date: '', quantity: '' }]);
  };

  const removeTask = (index: number) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter((_, i) => i !== index));
      setTasksErrors(tasksErrors.filter((_, i) => i !== index));
    }
  };

  // --- Submit final ---
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar todas las tareas antes de enviar
    const isValid = validateAllTasks();
    
    if (!isValid) {
      showAlert('warning', 'Por favor completa todos los campos de las tareas correctamente.');
      return;
    }

    try {
      setLoading(true);
      // Convertir owner_id a int antes de enviar
      const selectedOng = ongs.find(ong => ong.id === parseInt(formData.owner_id as string, 10));
      const ongName = selectedOng ? selectedOng.name : '';

      const payload = { 
        ...formData, 
        owner_id: parseInt(formData.owner_id as string, 10),
        owner_name: ongName,
        tasks 
      };
      console.log(payload)
      const response = await fetch('http://localhost:8000/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo crear el proyecto`);
      }

      const data = await response.json();
      showAlert('success', 'Proyecto y tareas creados con éxito!');

      // // Reset
      setFormData({ name: '', description: '', start_date: '', end_date: '', owner_id: '', status: 'active' });
      setTasks([{ title: '', necessity: '', start_date: '', end_date: '', resolves_by_itself: false, quantity: '' }]);
      setTasksErrors([{ title: '', necessity: '', start_date: '', end_date: '', quantity: '' }]);
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
                tasksErrors={tasksErrors}
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