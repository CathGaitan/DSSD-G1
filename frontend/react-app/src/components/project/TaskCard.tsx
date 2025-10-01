import React from 'react';
import { InputField } from '../ui/InputField';
import { TextAreaField } from '../ui/TextAreaField';
import type { Task } from '../../types/project.types';

interface TaskCardProps {
  task: Task;
  index: number;
  canRemove: boolean;
  onChange: (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onRemove: (index: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  index, 
  canRemove, 
  onChange, 
  onRemove 
}) => (
  <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-semibold text-gray-700">Tarea #{index + 1}</h3>
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700 text-sm font-medium hover:bg-red-50 px-3 py-1 rounded transition-all"
        >
          🗑️ Eliminar
        </button>
      )}
    </div>

    <div className="space-y-4">
      <InputField
        label="Título de la tarea"
        name="title"
        value={task.title}
        onChange={(e) => onChange(index, e)}
        required
        placeholder="Ej: Excavación y preparación del terreno"
      />

      <TextAreaField
        label="Necesidad"
        name="necessity"
        value={task.necessity}
        onChange={(e) => onChange(index, e)}
        required
        placeholder="Especifica qué se necesita para completar esta tarea..."
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Inicio"
          name="start_date"
          type="date"
          value={task.start_date}
          onChange={(e) => onChange(index, e)}
          required
        />
        <InputField
          label="Fin"
          name="end_date"
          type="date"
          value={task.end_date}
          onChange={(e) => onChange(index, e)}
          required
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer group">
        <input
          type="checkbox"
          name="resolves_by_itself"
          checked={task.resolves_by_itself}
          onChange={(e) => onChange(index, e)}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
        />
        <span className="text-sm text-gray-700 group-hover:text-gray-900">
          ¿Como ONG resolvera esta tarea por sí misma?
        </span>
      </label>
    </div>
  </div>
);