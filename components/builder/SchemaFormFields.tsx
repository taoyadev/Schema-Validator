'use client';

import { useState } from 'react';
import type { SchemaTemplate, SchemaField } from '@/lib/builder/templates';
import type { FormData } from '@/lib/builder/generator';
import { Badge } from '@/components/ui/badge';

interface SchemaFormFieldsProps {
  template: SchemaTemplate;
  formData: FormData;
  onChange: (data: FormData) => void;
}

export function SchemaFormFields({ template, formData, onChange }: SchemaFormFieldsProps) {
  const handleFieldChange = (fieldName: string, value: unknown) => {
    onChange({
      ...formData,
      [fieldName]: value,
    });
  };

  return (
    <div className="space-y-6">
      {template.fields.map((field) => (
        <FieldRenderer
          key={field.name}
          field={field}
          value={formData[field.name]}
          onChange={(value) => handleFieldChange(field.name, value)}
        />
      ))}
    </div>
  );
}

interface FieldRendererProps {
  field: SchemaField;
  value: unknown;
  onChange: (value: unknown) => void;
  parentPath?: string;
}

function FieldRenderer({ field, value, onChange, parentPath = '' }: FieldRendererProps) {
  const [isExpanded, setIsExpanded] = useState(field.required || false);

  const fieldPath = parentPath ? `${parentPath}.${field.name}` : field.name;

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'url':
        return (
          <input
            type={field.type === 'url' ? 'url' : 'text'}
            value={value ? String(value) : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value ? String(value) : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            step="any"
            value={value !== undefined && value !== null ? String(value) : ''}
            onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value ? String(value).split('T')[0] : ''}
            onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        );

      case 'select':
        return (
          <select
            value={value ? String(value) : field.defaultValue ? String(field.defaultValue) : ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Select...</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'image':
        const imageValue = value ? String(value) : '';
        return (
          <div className="space-y-2">
            <input
              type="url"
              value={imageValue}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            {imageValue && (
              <div className="relative w-full h-32 bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={imageValue}
                  alt={field.label}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        );

      case 'nested':
        return (
          <NestedFieldRenderer
            field={field}
            value={value as FormData | FormData[]}
            onChange={onChange}
            parentPath={fieldPath}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {field.required ? (
          <Badge variant="destructive" className="text-xs">Required</Badge>
        ) : (
          <Badge variant="secondary" className="text-xs">Optional</Badge>
        )}
      </div>

      {renderField()}

      {field.helpText && (
        <p className="text-xs text-gray-500">{field.helpText}</p>
      )}
    </div>
  );
}

interface NestedFieldRendererProps {
  field: SchemaField;
  value: FormData | FormData[] | undefined;
  onChange: (value: unknown) => void;
  parentPath: string;
}

function NestedFieldRenderer({ field, value, onChange, parentPath }: NestedFieldRendererProps) {
  const [isExpanded, setIsExpanded] = useState(field.required || false);

  // Determine if this is an array field (like breadcrumbs, FAQs, steps)
  const isArrayField = ['itemListElement', 'mainEntity', 'step'].includes(field.name);

  if (isArrayField) {
    return (
      <ArrayFieldRenderer
        field={field}
        value={value as FormData[]}
        onChange={onChange}
        parentPath={parentPath}
      />
    );
  }

  // Single nested object
  const nestedData = (value as FormData) || {};

  const handleNestedChange = (nestedFieldName: string, nestedValue: unknown) => {
    onChange({
      ...nestedData,
      [nestedFieldName]: nestedValue,
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {isExpanded ? 'Hide' : 'Show'} {field.label}
      </button>

      {isExpanded && field.nestedFields && (
        <div className="space-y-4">
          {field.nestedFields.map((nestedField) => (
            <FieldRenderer
              key={nestedField.name}
              field={nestedField}
              value={nestedData[nestedField.name]}
              onChange={(val) => handleNestedChange(nestedField.name, val)}
              parentPath={`${parentPath}.${field.name}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ArrayFieldRendererProps {
  field: SchemaField;
  value: FormData[] | undefined;
  onChange: (value: unknown) => void;
  parentPath: string;
}

function ArrayFieldRenderer({ field, value, onChange, parentPath }: ArrayFieldRendererProps) {
  const items = value || [{}];

  const handleAddItem = () => {
    onChange([...items, {}]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems.length > 0 ? newItems : [{}]);
  };


  const handleFieldChange = (index: number, nestedFieldName: string, nestedValue: unknown) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [nestedFieldName]: nestedValue,
    };
    onChange(newItems);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              {field.label} #{index + 1}
            </h4>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Remove
              </button>
            )}
          </div>

          {field.nestedFields?.map((nestedField) => (
            <FieldRenderer
              key={nestedField.name}
              field={nestedField}
              value={item[nestedField.name]}
              onChange={(val) => handleFieldChange(index, nestedField.name, val)}
              parentPath={`${parentPath}[${index}]`}
            />
          ))}
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddItem}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add {field.label}
      </button>
    </div>
  );
}
