import React from 'react';
import { InputField } from '../ui/InputField';
import { TextAreaField } from '../ui/TextAreaField';
import { Button } from '../ui/Button';
import type { Task } from '../../types/project.types';

interface TaskCardProps {
  task: Task;
  index: number;
  canRemove: boolean;
  taskErrors?: {
    title: string;
    necessity: string;
    start_date: string;
    end_date: string;
    quantity: string;
  };
  onChange: (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onRemove: (index: number) => void;
  // --- NUEVA PROP ---
  isLocalOnly: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  index, 
  canRemove,
  taskErrors,
  onChange, 
  onRemove,
  // --- Destructuramos ---
  isLocalOnly 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(index, e);
  };
  
  // --- Lógica para forzar el estado en modo local ---
  const isResolvesByItselfChecked = isLocalOnly ? true : task.resolves_by_itself;
  const isResolvesByItselfDisabled = isLocalOnly;
  // ----------------------------------------------------

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Tarea {index + 1}</h3>
        {canRemove && (
          <Button
            type="button"
            onClick={() => onRemove(index)}
            variant="ghost"
            className="text-red-600 hover:bg-red-50"
          >
            🗑️ Eliminar
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <InputField
          label="Título de la Tarea"
          name="title"
          value={task.title}
          onChange={handleChange}
          required
          placeholder="Ej: Excavación y preparación del terreno"
          error={taskErrors?.title}
        />

        <TextAreaField
          label="Descripción de la Necesidad"
          name="necessity"
          value={task.necessity}
          onChange={handleChange}
          required
          placeholder="Especifica qué se necesita para completar esta tarea..."
          error={taskErrors?.necessity}
        />

        <InputField
          label="Cantidad"
          name="quantity"
          value={task.quantity}
          onChange={handleChange}
          required
          placeholder="Ej: 5 toneladas, 10 personas, 3 días, etc."
          error={taskErrors?.quantity}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Fecha de Inicio"
            name="start_date"
            type="date"
            value={task.start_date}
            onChange={handleChange}
            required
            error={taskErrors?.start_date}
          />
          <InputField
            label="Fecha de Finalización"
            name="end_date"
            type="date"
            value={task.end_date}
            onChange={handleChange}
            required
            error={taskErrors?.end_date}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="resolves_by_itself"
            // --- Aplicamos el estado y la deshabilitación condicionales ---
            checked={isResolvesByItselfChecked} 
            onChange={handleChange}
            disabled={isResolvesByItselfDisabled}
            // Agregamos estilo para el estado deshabilitado
            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />
          <label className={`text-sm text-gray-700 ${isResolvesByItselfDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
            ¿Como ONG resolverá esta tarea por sí misma?
          </label>
        </div>
        
        {/* Mensaje adicional para el usuario en modo local */}
        {isLocalOnly && (
            <p className="text-xs text-purple-600 mt-1">
                * El modo de aplicación local requiere que todas las tareas se resuelvan internamente.
            </p>
        )}
      </div>
    </div>
  );
};