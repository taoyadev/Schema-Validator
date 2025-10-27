'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { ValidationResponse } from '@/lib/validation/types';
import { SchemaBuilder } from '@/components/builder/SchemaBuilder';
import { SchemaEditor } from '@/components/editor/SchemaEditor';

interface ValidationFormProps {
  onValidationComplete: (results: ValidationResponse) => void;
  onValidationStart?: () => void;
}

export function ValidationForm({
  onValidationComplete,
  onValidationStart,
}: ValidationFormProps) {
  const [mode, setMode] = useState<'url' | 'json-ld' | 'build'>('url');
  const [urlInput, setUrlInput] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useMonacoEditor, setUseMonacoEditor] = useState(true);
  const [liveValidationResult, setLiveValidationResult] = useState<ValidationResponse | null>(null);

  const validateUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validateJsonLd = (json: string): boolean => {
    try {
      JSON.parse(json);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const input = mode === 'url' ? urlInput.trim() : jsonInput.trim();

    if (!input) {
      setError(`Please enter a ${mode === 'url' ? 'URL' : 'JSON-LD'}`);
      return;
    }

    if (mode === 'url' && !validateUrl(input)) {
      setError('Please enter a valid URL (must start with http:// or https://)');
      return;
    }

    if (mode === 'json-ld' && !validateJsonLd(input)) {
      setError('Please enter valid JSON-LD');
      return;
    }

    // If we have live validation result for JSON-LD mode with Monaco editor, use it
    if (mode === 'json-ld' && useMonacoEditor && liveValidationResult) {
      onValidationComplete(liveValidationResult);
      return;
    }

    setIsLoading(true);
    onValidationStart?.();

    try {
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: mode,
          input: mode === 'url' ? input : JSON.parse(input),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: 'Unknown error',
        }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data: ValidationResponse = await response.json();
      onValidationComplete(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to validate schema'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuilderGenerate = (jsonLd: string) => {
    // Populate JSON-LD input and switch to validation mode
    setJsonInput(jsonLd);
    setMode('json-ld');
    // Trigger validation
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }, 100);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <Tabs value={mode} onValueChange={(v) => setMode(v as 'url' | 'json-ld' | 'build')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="build">Build Schema</TabsTrigger>
          <TabsTrigger value="url">Validate URL</TabsTrigger>
          <TabsTrigger value="json-ld">Validate JSON-LD</TabsTrigger>
        </TabsList>

        <TabsContent value="build" className="space-y-4">
          <SchemaBuilder onGenerate={handleBuilderGenerate} />
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url-input">Website URL</Label>
            <Input
              id="url-input"
              type="url"
              placeholder="https://example.com"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={isLoading}
              className="text-base"
            />
            <p className="text-sm text-muted-foreground">
              Enter the URL of a webpage to extract and validate its structured
              data
            </p>
          </div>
        </TabsContent>

        <TabsContent value="json-ld" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Label>JSON-LD Code</Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {useMonacoEditor ? 'Advanced Editor' : 'Simple Editor'}
              </span>
              <button
                type="button"
                onClick={() => setUseMonacoEditor(!useMonacoEditor)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  useMonacoEditor ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    useMonacoEditor ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {useMonacoEditor ? (
            <SchemaEditor
              value={jsonInput}
              onChange={setJsonInput}
              onValidationComplete={setLiveValidationResult}
              height="500px"
              liveValidation={true}
            />
          ) : (
            <div className="space-y-2">
              <Textarea
                id="json-input"
                placeholder={`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Your Article Title",
  ...
}`}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                disabled={isLoading}
                className="min-h-[200px] font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                Paste your JSON-LD structured data for validation
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {error && mode !== 'build' && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {mode !== 'build' && (
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Validating...' : 'Validate Schema'}
        </Button>
      )}
    </form>
  );
}
