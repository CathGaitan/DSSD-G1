import React from 'react';
import { Button } from '../ui/Button';
import { TaskCard } from './TaskCard';
import type { Task } from '../../types/project.types';

interface TasksFormProps {
  tasks: Task[];
  loading: boolean;
  tasksErrors: Array<{
    title: string;
    necessity: string;
    start_date: string;
    end_date: string;
    quantity: string;
  }>;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  onTaskChange: (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onAddTask: () => void;
  onRemoveTask: (index: number) => void;
}

export const TasksForm: React.FC<TasksFormProps> = ({ 
  tasks, 
  loading,
  tasksErrors,
  onSubmit, 
  onBack, 
  onTaskChange, 
  onAddTask, 
  onRemoveTask 
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  // Verificar si hay algún error en las tareas
  const hasErrors = tasksErrors.some(taskError => 
    Object.values(taskError).some(error => error !== '')
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
        <h2 className="text-2xl font-bold text-purple-900 mb-2 flex items-center gap-2">
          <span>📋</span> Tareas del Proyecto
        </h2>
        <p className="text-sm text-purple-700">Define las tareas necesarias para completar el proyecto</p>
      </div>

      <div className="space-y-4">
        {tasks.map((task, index) => (
          <TaskCard
            key={index}
            task={task}
            index={index}
            canRemove={tasks.length > 1}
            taskErrors={tasksErrors[index]}
            onChange={onTaskChange}
            onRemove={onRemoveTask}
          />
        ))}
      </div>

      <Button
        type="button"
        onClick={onAddTask}
        variant="ghost"
        className="w-full border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50"
      >
        ➕ Agregar otra tarea
      </Button>

      <div className="flex justify-between items-center pt-6 border-t">
        <Button type="button" onClick={onBack} variant="ghost">
          ← Volver
        </Button>
        <Button type="submit" variant="success" disabled={loading || hasErrors} onClick={handleSubmit}>
          {loading ? (
            <>
              <span className="inline-block animate-spin mr-2">⏳</span>
              Creando...
            </>
          ) : (
            '✅ Crear Proyecto con Tareas'
          )}
        </Button>
      </div>
    </div>
  );
};