'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { ValidationResponse } from '@/lib/validation/types';

interface ValidationFormProps {
  onValidationComplete: (results: ValidationResponse) => void;
  onValidationStart?: () => void;
}

export function ValidationForm({
  onValidationComplete,
  onValidationStart,
}: ValidationFormProps) {
  const [mode, setMode] = useState<'url' | 'json-ld'>('url');
  const [urlInput, setUrlInput] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <Tabs value={mode} onValueChange={(v) => setMode(v as 'url' | 'json-ld')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url">Validate URL</TabsTrigger>
          <TabsTrigger value="json-ld">Validate JSON-LD</TabsTrigger>
        </TabsList>

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
          <div className="space-y-2">
            <Label htmlFor="json-input">JSON-LD Code</Label>
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
        </TabsContent>
      </Tabs>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Validating...' : 'Validate Schema'}
      </Button>
    </form>
  );
}
