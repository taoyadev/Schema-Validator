'use client';

import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  validateLive,
  cancelValidation,
  validateJsonSyntax,
  getQuickValidationErrors,
} from '@/lib/validation/live-validator';
import type { ValidationResponse } from '@/lib/validation/types';

interface SchemaEditorProps {
  value: string;
  onChange: (value: string) => void;
  onValidationComplete?: (result: ValidationResponse | null) => void;
  height?: string;
  readOnly?: boolean;
  liveValidation?: boolean;
}

export function SchemaEditor({
  value,
  onChange,
  onValidationComplete,
  height = '400px',
  readOnly = false,
  liveValidation = true,
}: SchemaEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [syntaxErrors, setSyntaxErrors] = useState<string[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationResponse | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Handle editor mount
  const handleEditorMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;

    // Configure editor options
    editor.updateOptions({
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: 'on',
      roundedSelection: true,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: 'on',
      formatOnPaste: true,
      formatOnType: true,
    });
  };

  // Handle value change
  const handleChange = (newValue: string | undefined) => {
    const val = newValue || '';
    onChange(val);

    // Quick syntax validation
    const quickErrors = getQuickValidationErrors(val);
    setSyntaxErrors(quickErrors);

    // Live validation
    if (liveValidation && val.trim()) {
      setIsValidating(true);
      validateLive(
        val,
        (result, error) => {
          setIsValidating(false);
          setValidationResult(result);
          setValidationError(error);
          if (onValidationComplete) {
            onValidationComplete(result);
          }
        },
        800 // 800ms debounce for live validation
      );
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelValidation();
    };
  }, []);

  // Format JSON
  const handleFormat = () => {
    if (!editorRef.current) return;

    const syntaxCheck = validateJsonSyntax(value);
    if (syntaxCheck.valid && syntaxCheck.parsedData) {
      const formatted = JSON.stringify(syntaxCheck.parsedData, null, 2);
      onChange(formatted);
    }
  };

  // Insert template
  const handleInsertTemplate = () => {
    const template = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Your Article Title',
      description: 'Article description',
      image: 'https://example.com/image.jpg',
      author: {
        '@type': 'Person',
        name: 'Author Name',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Publisher Name',
        logo: {
          '@type': 'ImageObject',
          url: 'https://example.com/logo.jpg',
        },
      },
      datePublished: new Date().toISOString(),
    };

    onChange(JSON.stringify(template, null, 2));
  };

  const hasSyntaxErrors = syntaxErrors.length > 0;
  const hasValidationErrors = validationResult && validationResult.summary.totalErrors > 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">JSON-LD Editor</CardTitle>
              {isValidating && (
                <Badge variant="secondary" className="text-xs">
                  <svg className="animate-spin -ml-1 mr-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Validating...
                </Badge>
              )}
              {!isValidating && validationResult && (
                <Badge
                  variant={hasValidationErrors ? 'destructive' : 'success'}
                  className="text-xs"
                >
                  Score: {validationResult.overallScore}
                </Badge>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleFormat}
                disabled={hasSyntaxErrors}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400"
              >
                Format
              </button>
              <button
                onClick={handleInsertTemplate}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Insert Template
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Editor
            height={height}
            defaultLanguage="json"
            value={value}
            onChange={handleChange}
            onMount={handleEditorMount}
            theme="vs-light"
            options={{
              readOnly,
              scrollbar: {
                vertical: 'auto',
                horizontal: 'auto',
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Syntax Errors */}
      {hasSyntaxErrors && (
        <Alert variant="destructive">
          <AlertDescription>
            <div className="space-y-1">
              {syntaxErrors.map((error, index) => (
                <p key={index} className="text-sm">
                  • {error}
                </p>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Validation Error */}
      {!hasSyntaxErrors && validationError && (
        <Alert variant="destructive">
          <AlertDescription className="text-sm">
            {validationError}
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      {!hasSyntaxErrors && !isValidating && validationResult && (
        <Card className="bg-slate-50">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Schemas</p>
                <p className="text-lg font-bold">{validationResult.schemas.length}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Passed</p>
                <p className="text-lg font-bold text-green-600">
                  {validationResult.summary.totalPassed}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Warnings</p>
                <p className="text-lg font-bold text-yellow-600">
                  {validationResult.summary.totalWarnings}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Errors</p>
                <p className="text-lg font-bold text-red-600">
                  {validationResult.summary.totalErrors}
                </p>
              </div>
            </div>

            {validationResult.summary.totalErrors > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Top Issues:</h4>
                <div className="space-y-1">
                  {validationResult.schemas[0]?.errors.slice(0, 3).map((error, index) => (
                    <p key={index} className="text-xs text-red-600">
                      • {error.property}: {error.message}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
