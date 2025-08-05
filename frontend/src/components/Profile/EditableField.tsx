import React from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { FormInput, FormTextarea } from "../ui";

interface EditableFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (value: string) => void;
  onCancel: () => void;
  type?: 'text' | 'email' | 'tel' | 'textarea';
  placeholder?: string;
  rtl?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  type = 'text',
  placeholder,
  rtl = false,
}) => {
  const [editValue, setEditValue] = React.useState(value);

  React.useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(editValue);
  };

  const handleCancel = () => {
    setEditValue(value);
    onCancel();
  };

  return (
    <div className={`form-control w-full ${rtl ? 'text-right' : ''}`}>
      <label className="label">
        <span className="label-text font-medium font-jakarta">{label}</span>
        {!isEditing && (
          <button
            onClick={onEdit}
            className="btn btn-ghost btn-xs text-accent hover:text-accent/80"
            title="Edit"
          >
            <Edit2 className="w-3 h-3" />
          </button>
        )}
      </label>
      
      {isEditing ? (
        <div className="flex gap-2">
          {type === 'textarea' ? (
            <FormTextarea
              className="textarea textarea-bordered flex-1 font-jakarta"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={placeholder}
              dir={rtl ? 'rtl' : 'ltr'}
            />
          ) : (
            <FormInput
              type={type}
              className="input input-bordered flex-1 font-jakarta"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={placeholder}
              dir={rtl ? 'rtl' : 'ltr'}
            />
          )}
          <button
            onClick={handleSave}
            className="btn btn-primary btn-sm"
            title="Save"
          >
            <Save className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancel}
            className="btn btn-ghost btn-sm"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="p-3 bg-base-200 rounded-lg min-h-[3rem] flex items-center font-jakarta">
          {value || (
            <span className="text-neutral/50 italic">
              {placeholder || `Enter ${label.toLowerCase()}`}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default EditableField; 