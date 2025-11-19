import React, { useState, useEffect } from 'react';
import { StepIndicator } from '../components/project/StepIndicator';
import { ProjectForm } from '../components/project/ProjectForm';
import { TasksForm } from '../components/project/TasksForm';
import { Alert, useAlert } from '../components/ui/Alert';
import type { Ong, Task, ProjectFormData } from '../types/project.types';
import { api } from '../api/api';

const CreateProjectForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [ongs, setOngs] = useState<Ong[]>([]);
  const [isLocalOnly, setIsLocalOnly] = useState(false);
  
  const initialTask: Task = { 
    title: '', 
    necessity: '', 
    start_date: '', 
    end_date: '', 
    resolves_by_itself: false, 
    quantity: '' 
  };
    
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
  const [tasks, setTasks] = useState<Task[]>([initialTask]);
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
  
  const { alert, showAlert, closeAlert } = useAlert();

  useEffect(() => {
    const localToken = localStorage.getItem('local_token');
    const cloudToken = localStorage.getItem('cloud_token');
    const localOnly = !!localToken && !cloudToken;
    setIsLocalOnly(localOnly);

    const fetchUserOngs = async () => {
        try {
            const userOngs = await api.getMyOngs();
            
            if (userOngs && userOngs.length > 0) {
                setOngs(userOngs);
                if (userOngs.length === 1 && formData.owner_id === 0) {
                     setFormData(prev => ({ ...prev, owner_id: userOngs[0].id }));
                }
            } else {
                 setOngs([]);
                 showAlert('warning', 'Tu usuario no está asociado a ninguna ONG.');
            }
        } catch (error) {
            console.error('Error fetching ONGs:', error);
            showAlert('error', 'Error al cargar las ONGs del usuario. Asegúrate de estar logueado.');
        }
    };
    
    fetchUserOngs();
    
    setTasks(prevTasks => {
        if (localOnly) {
            return prevTasks.map(task => ({
                ...task,
                resolves_by_itself: true
            }));
        }
        return prevTasks;
    });
    
  }, []);

  const validateDates = (start: string, end: string) => {
    if (start && end && new Date(end) < new Date(start)) {
      setDateError('La fecha de finalización no puede ser anterior a la de inicio.');
    } else {
      setDateError('');
    }
  };

  const validateField = (name: string, value: string | number) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!String(value).trim()) { 
          error = 'El nombre del proyecto es obligatorio';
        } else if (String(value).trim().length < 3) {
          error = 'El nombre debe tener al menos 3 caracteres';
        }
        break;
      case 'description':
        if (!String(value).trim()) {
          error = 'La descripción es obligatoria';
        } else if (String(value).trim().length < 15) {
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
        if (Number(value) === 0) { 
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

    if (Number(formData.owner_id) === 0) {
      errors.owner_id = 'Debes seleccionar una ONG';
      isValid = false;
    }
    
    if (ongs.length === 0) {
        errors.owner_id = errors.owner_id || 'Tu usuario no está asociado a ninguna ONG.';
        isValid = false;
    }


    setFieldErrors(errors);
    return isValid;
  };

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
    if (newTasksErrors[index]) {
        newTasksErrors[index] = { ...newTasksErrors[index], [name]: error };
        setTasksErrors(newTasksErrors);
    }
    
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
    const isNumberField = name === 'owner_id';
    
    const finalValue = isNumberField ? Number(value) : value;

    const newFormData = { ...formData, [name]: finalValue };
    setFormData(newFormData);

    validateField(name, finalValue);

    if (name === 'start_date' || name === 'end_date') {
      validateDates(newFormData.start_date, newFormData.end_date);
    }
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validateAllFields();
    
    if (!isValid) {
      showAlert('warning', 'Por favor completa todos los campos obligatorios correctamente.');
      return;
    }
    
    if (dateError) {
      showAlert('warning', 'Corrige las fechas antes de continuar.');
      return;
    }
    
    setTasks(prevTasks => {
        return prevTasks.map(task => ({
            ...task,
            resolves_by_itself: isLocalOnly || task.resolves_by_itself
        }));
    });
    
    setStep(2);
  };

  const handleTaskChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    const taskValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;
    
    if (isLocalOnly && name === 'resolves_by_itself' && !taskValue) {
        return; 
    }
    
    const updatedTasks = [...tasks];
    
    if (name !== 'resolves_by_itself') {
         updatedTasks[index] = {
            ...updatedTasks[index],
            [name]: taskValue,
        };
        validateTaskField(index, name, value);
    } else {
        updatedTasks[index] = {
            ...updatedTasks[index],
            [name]: isLocalOnly ? true : taskValue,
        };
    }
    
    setTasks(updatedTasks);
  };

  const addTask = () => {
    const newTask: Task = { 
        title: '', 
        necessity: '', 
        start_date: '', 
        end_date: '', 
        resolves_by_itself: isLocalOnly, 
        quantity: '' 
    };
    setTasks([...tasks, newTask]);
    setTasksErrors([...tasksErrors, { title: '', necessity: '', start_date: '', end_date: '', quantity: '' }]);
  };

  const removeTask = (index: number) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter((_, i) => i !== index));
      setTasksErrors(tasksErrors.filter((_, i) => i !== index));
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateAllTasks();
    
    if (!isValid) {
      showAlert('warning', 'Por favor completa todos los campos de las tareas correctamente.');
      return;
    }

    try {
      setLoading(true);
      
      const payloadTasks = tasks.map(task => {
          const finalResolvesByItself = isLocalOnly ? true : task.resolves_by_itself;

          const { id, ...rest } = task;
          return {
              ...rest,
              resolves_by_itself: finalResolvesByItself
          }
      });
      
      const payload = { 
        ...formData, 
        owner_id: Number(formData.owner_id),
        tasks: payloadTasks,
      };
      
      await api.createProject(payload); 

      showAlert('success', 'Proyecto y tareas creados con éxito!');

      const newTaskAfterReset: Task = { 
        title: '', 
        necessity: '', 
        start_date: '', 
        end_date: '', 
        resolves_by_itself: isLocalOnly,
        quantity: '' 
      };

      setFormData({ name: '', description: '', start_date: '', end_date: '', owner_id: 0, status: 'active' }); 
      setTasks([newTaskAfterReset]); 
      setTasksErrors([tasksErrors[0]]);
      setFieldErrors({ name: '', description: '', start_date: '', end_date: '', owner_id: '' });
      setStep(1);
    } catch (error) {
      console.error('Error creando el proyecto:', error);
      showAlert('error', error instanceof Error ? error.message : 'Hubo un error al crear el proyecto.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full">
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
                isLocalOnly={isLocalOnly}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectForm;