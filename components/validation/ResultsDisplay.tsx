'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RichResultsPreview } from './RichResultsPreview';
import { PropertyTreeView } from './PropertyTreeView';
import { DeviceSimulator } from './DeviceSimulator';
import { ShareExportButtons } from './ShareExportButtons';
import type { ValidationResponse } from '@/lib/validation/types';

interface ResultsDisplayProps {
  results: ValidationResponse;
}

type TabType = 'overview' | 'rich-results' | 'schema-tree';

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [deviceType, setDeviceType] = useState<'mobile' | 'desktop'>('desktop');

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const { totalErrors, totalWarnings, totalPassed } = results.summary;
  const totalSchemas = results.schemas.length;

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle>Validation Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
              <p className={`text-4xl font-bold ${getScoreColor(results.overallScore)}`}>
                {results.overallScore}
                <span className="text-lg font-normal text-muted-foreground">
                  {' '}
                  / 100
                </span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {getScoreLabel(results.overallScore)}
              </p>
            </div>
            <div className="text-right">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="success">{totalPassed} Passed</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="warning">{totalWarnings} Warnings</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">{totalErrors} Errors</Badge>
                </div>
              </div>
            </div>
          </div>
          <Progress value={results.overallScore} className="h-3" />
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Schemas Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalSchemas}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Rich Results Eligible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {results.schemas.filter((r) => r.richResultsEligible).length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Validated At
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">
              {new Date(results.timestamp).toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* No Schemas Found */}
      {totalSchemas === 0 && (
        <Alert>
          <AlertTitle>No Structured Data Found</AlertTitle>
          <AlertDescription>
            No JSON-LD structured data was found in the provided input. Make
            sure your page includes{' '}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">
              &lt;script type=&quot;application/ld+json&quot;&gt;
            </code>{' '}
            tags with valid Schema.org markup.
          </AlertDescription>
        </Alert>
      )}

      {/* Share and Export Buttons */}
      {totalSchemas > 0 && (
        <Card>
          <CardContent className="pt-6">
            <ShareExportButtons results={results} />
          </CardContent>
        </Card>
      )}

      {/* Tab Navigation */}
      {totalSchemas > 0 && (
        <>
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('rich-results')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'rich-results'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Rich Results Preview
            </button>
            <button
              onClick={() => setActiveTab('schema-tree')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'schema-tree'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Schema Tree
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {results.schemas.map((result, index) => (
                  <SchemaCard key={index} result={result} index={index} />
                ))}
              </div>
            )}

            {activeTab === 'rich-results' && (
              <div className="space-y-6">
                {results.schemas.map((result, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Schema #{index + 1}: {result.schema.type}
                    </h3>
                    <DeviceSimulator onDeviceChange={setDeviceType}>
                      <RichResultsPreview result={result} deviceType={deviceType} />
                    </DeviceSimulator>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'schema-tree' && (
              <div className="space-y-6">
                {results.schemas.map((result, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Schema #{index + 1}: {result.schema.type}
                    </h3>
                    <PropertyTreeView result={result} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function SchemaCard({
  result,
  index,
}: {
  result: ValidationResponse['schemas'][0];
  index: number;
}) {
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">
              Schema #{index + 1}: {result.schema.type}
            </CardTitle>
            {result.richResultsEligible && (
              <Badge variant="success">Rich Results Eligible</Badge>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">SEO Score</p>
            <p className={`text-xl font-bold ${getScoreColor(result.seoScore)}`}>
              {result.seoScore}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Completeness */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Completeness</span>
            <span className="font-medium">{result.completeness}%</span>
          </div>
          <Progress value={result.completeness} className="h-2" />
        </div>

        {/* Errors */}
        {result.errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Badge variant="destructive">{result.errors.length}</Badge>
              Errors
            </h4>
            <div className="space-y-2">
              {result.errors.map((error, i) => (
                <Alert key={i} variant="destructive">
                  <AlertTitle className="text-sm font-medium">
                    {error.property || 'Validation Error'}
                  </AlertTitle>
                  <AlertDescription className="text-sm">
                    <p>{error.message}</p>
                    {error.fix && (
                      <p className="mt-1 font-mono text-xs bg-destructive/10 p-2 rounded">
                        {error.fix}
                      </p>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Warnings */}
        {result.warnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Badge variant="warning">{result.warnings.length}</Badge>
              Warnings
            </h4>
            <div className="space-y-2">
              {result.warnings.map((warning, i) => (
                <Alert key={i} variant="warning">
                  <AlertTitle className="text-sm font-medium">
                    {warning.property || 'Validation Warning'}
                  </AlertTitle>
                  <AlertDescription className="text-sm">
                    <p>{warning.message}</p>
                    {warning.fix && (
                      <p className="mt-1 font-mono text-xs bg-yellow-500/10 p-2 rounded">
                        {warning.fix}
                      </p>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Passed Checks */}
        {result.passed.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Badge variant="success">{result.passed.length}</Badge>
              Passed Checks
            </h4>
            <div className="grid gap-2 text-sm">
              {result.passed.map((pass, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-muted-foreground"
                >
                  <span className="text-green-600">✓</span>
                  <span>{pass.property}: {pass.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
