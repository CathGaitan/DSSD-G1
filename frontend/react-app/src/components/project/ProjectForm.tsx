import React from 'react';
import { InputField } from '../ui/InputField';
import { TextAreaField } from '../ui/TextAreaField';
import { SelectField } from '../ui/SelectField';
import { Button } from '../ui/Button';
import type { Ong, ProjectFormData } from '../../types/project.types';

interface ProjectFormProps {
  formData: ProjectFormData;
  ongs: Ong[];
  dateError: string;
  fieldErrors: {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    owner_id: string;
  };
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ 
  formData, 
  ongs, 
  dateError,
  fieldErrors, 
  onSubmit, 
  onChange 
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  const hasErrors = Object.values(fieldErrors).some(error => error !== '') || !!dateError;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <h2 className="text-2xl font-bold text-blue-900 mb-2 flex items-center gap-2">
          <span>📋</span> Información del Proyecto
        </h2>
        <p className="text-sm text-blue-700">Complete los datos básicos del proyecto</p>
      </div>

      <InputField
        label="Nombre del Proyecto"
        name="name"
        value={formData.name}
        onChange={onChange}
        required
        placeholder="Ej: Construcción de un Centro Comunitario"
        error={fieldErrors.name}
      />

      <TextAreaField
        label="Descripción"
        name="description"
        value={formData.description}
        onChange={onChange}
        required
        placeholder="Describe brevemente el alcance y objetivos del proyecto..."
        error={fieldErrors.description}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Fecha de Inicio"
          name="start_date"
          type="date"
          value={formData.start_date}
          onChange={onChange}
          required
          error={fieldErrors.start_date}
        />
        <InputField
          label="Fecha de Finalización"
          name="end_date"
          type="date"
          value={formData.end_date}
          onChange={onChange}
          required
          error={dateError || fieldErrors.end_date}
        />
      </div>

      <SelectField
        label="ONG Responsable"
        name="owner_id"
        value={formData.owner_id}
        onChange={onChange}
        required
        options={ongs.map(ong => ({ value: ong.id, label: ong.name }))}
        placeholder="Seleccione una ONG"
        error={fieldErrors.owner_id}
      />

      <div className="flex justify-end pt-4">
        <Button type="submit" variant="primary" disabled={hasErrors} onClick={handleSubmit}>
          Agregar Tareas
        </Button>
      </div>
    </div>
  );
};