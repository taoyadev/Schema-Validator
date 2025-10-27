'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  schemaTemplates,
  getTemplatesByCategory,
  type SchemaTemplate,
} from '@/lib/builder/templates';
import {
  generateJsonLd,
  generateScriptTag,
  validateFormData,
  getDefaultFormData,
  type FormData,
} from '@/lib/builder/generator';
import { SchemaFormFields } from './SchemaFormFields';
import { SchemaPreview } from './SchemaPreview';

interface SchemaBuilderProps {
  onGenerate?: (jsonLd: string) => void;
}

export function SchemaBuilder({ onGenerate }: SchemaBuilderProps) {
  const [selectedType, setSelectedType] = useState<string>('Article');
  const [template, setTemplate] = useState<SchemaTemplate>(schemaTemplates.Article);
  const [formData, setFormData] = useState<FormData>({});
  const [generatedSchema, setGeneratedSchema] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<Array<{ field: string; message: string }>>([]);
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Update template when type changes
  useEffect(() => {
    const newTemplate = schemaTemplates[selectedType];
    if (newTemplate) {
      setTemplate(newTemplate);
      setFormData(getDefaultFormData(newTemplate));
      setValidationErrors([]);
    }
  }, [selectedType]);

  // Generate schema whenever form data changes
  useEffect(() => {
    if (template) {
      try {
        const jsonLd = generateJsonLd(template, formData);
        setGeneratedSchema(jsonLd);

        // Validate
        const validation = validateFormData(template, formData);
        setValidationErrors(validation.errors);
      } catch (error) {
        console.error('Schema generation error:', error);
      }
    }
  }, [template, formData]);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

  const handleFormDataChange = (newData: FormData) => {
    setFormData(newData);
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(generatedSchema);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyScript = async () => {
    try {
      const scriptTag = generateScriptTag(template, formData);
      await navigator.clipboard.writeText(scriptTag);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleValidateNow = () => {
    if (onGenerate) {
      onGenerate(generatedSchema);
    }
  };

  const categories = [
    { id: 'article', label: 'Article' },
    { id: 'product', label: 'Product' },
    { id: 'organization', label: 'Organization' },
    { id: 'navigation', label: 'Navigation' },
    { id: 'other', label: 'Other' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Schema Type Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Schema Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map((category) => {
            const templates = getTemplatesByCategory(category.id);
            if (templates.length === 0) return null;

            return (
              <div key={category.id}>
                <h3 className="text-sm font-medium text-gray-700 mb-2">{category.label}</h3>
                <div className="flex flex-wrap gap-2">
                  {templates.map((t) => (
                    <button
                      key={t.type}
                      onClick={() => handleTypeChange(t.type)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedType === t.type
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {t.displayName}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Template Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">{template.displayName}</h3>
              <p className="text-sm text-blue-700">{template.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form Fields */}
        <div>
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Schema Properties</CardTitle>
                {validationErrors.length > 0 && (
                  <Badge variant="destructive">{validationErrors.length} errors</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <SchemaFormFields
                template={template}
                formData={formData}
                onChange={handleFormDataChange}
              />

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="mt-4 space-y-2">
                  {validationErrors.map((error, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertDescription className="text-sm">
                        <strong>{error.field}:</strong> {error.message}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div>
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Generated Schema</CardTitle>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showPreview && (
                <SchemaPreview
                  jsonLd={generatedSchema}
                  template={template}
                />
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {copySuccess ? (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy JSON-LD
                    </>
                  )}
                </button>

                <button
                  onClick={handleCopyScript}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Copy Script Tag
                </button>

                {onGenerate && (
                  <button
                    onClick={handleValidateNow}
                    disabled={validationErrors.length > 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      validationErrors.length > 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Validate Now
                  </button>
                )}
              </div>

              {/* Help Text */}
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Copy the generated JSON-LD and paste it into a{' '}
                  <code className="bg-muted px-1 py-0.5 rounded">&lt;script type="application/ld+json"&gt;</code>{' '}
                  tag in your HTML, or use the "Copy Script Tag" button to get the complete tag.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
