'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { ComparisonResult } from '@/lib/comparison/types';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  ArrowRight,
  Award,
} from 'lucide-react';

interface ComparisonViewProps {
  comparison: ComparisonResult;
}

export function ComparisonView({ comparison }: ComparisonViewProps) {
  const { summary, schemas, insights } = comparison;

  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Comparison Summary</span>
            <div className="flex items-center gap-2">
              {summary.improvement ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
              <span
                className={`text-2xl font-bold ${
                  summary.improvement ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {summary.overallScoreDelta > 0 ? '+' : ''}
                {summary.overallScoreDelta}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Errors Fixed"
              value={summary.errorsFixed}
              icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
              variant="success"
            />
            <StatCard
              label="Errors New"
              value={summary.errorsNew}
              icon={<XCircle className="h-4 w-4 text-red-600" />}
              variant="error"
            />
            <StatCard
              label="Warnings Fixed"
              value={summary.warningsFixed}
              icon={<CheckCircle2 className="h-4 w-4 text-yellow-600" />}
              variant="warning"
            />
            <StatCard
              label="Warnings New"
              value={summary.warningsNew}
              icon={<AlertTriangle className="h-4 w-4 text-yellow-600" />}
              variant="warning"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <StatCard
              label="Schemas Added"
              value={summary.schemasAdded}
              icon={<Plus className="h-4 w-4 text-blue-600" />}
            />
            <StatCard
              label="Schemas Removed"
              value={summary.schemasRemoved}
              icon={<Minus className="h-4 w-4 text-gray-600" />}
            />
            <StatCard
              label="Schemas Modified"
              value={summary.schemasModified}
              icon={<Info className="h-4 w-4 text-blue-600" />}
            />
            <StatCard
              label="Rich Results Gained"
              value={summary.richResultsGained}
              icon={<Award className="h-4 w-4 text-purple-600" />}
              variant="success"
            />
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Major Improvements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Improvements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {insights.majorImprovements.length > 0 ? (
              <ul className="space-y-2">
                {insights.majorImprovements.map((improvement, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No significant improvements detected
              </p>
            )}
          </CardContent>
        </Card>

        {/* Major Regressions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Regressions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {insights.majorRegressions.length > 0 ? (
              <ul className="space-y-2">
                {insights.majorRegressions.map((regression, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>{regression}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No regressions detected
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {insights.recommendations.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {insights.recommendations.map((recommendation, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      {/* Schema Changes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Schema Changes</h3>
        {schemas.map((schema, index) => (
          <SchemaComparisonCard key={index} schema={schema} />
        ))}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  variant,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
  variant?: 'success' | 'error' | 'warning';
}) {
  const getBgColor = () => {
    if (variant === 'success') return 'bg-green-50 border-green-200';
    if (variant === 'error') return 'bg-red-50 border-red-200';
    if (variant === 'warning') return 'bg-yellow-50 border-yellow-200';
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <div className={`border rounded-lg p-3 ${getBgColor()}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-600">{label}</span>
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function SchemaComparisonCard({
  schema,
}: {
  schema: ComparisonResult['schemas'][0];
}) {
  const getChangeTypeColor = (changeType: typeof schema.changeType) => {
    switch (changeType) {
      case 'added':
        return 'bg-green-100 text-green-800';
      case 'removed':
        return 'bg-red-100 text-red-800';
      case 'modified':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getChangeTypeIcon = (changeType: typeof schema.changeType) => {
    switch (changeType) {
      case 'added':
        return <Plus className="h-4 w-4" />;
      case 'removed':
        return <Minus className="h-4 w-4" />;
      case 'modified':
        return <ArrowRight className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{schema.type}</CardTitle>
            <Badge
              className={`${getChangeTypeColor(schema.changeType)} flex items-center gap-1`}
            >
              {getChangeTypeIcon(schema.changeType)}
              {schema.changeType.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Changes */}
        {schema.changes.score ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">SEO Score</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {schema.changes.score.before}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <span
                  className={`text-sm font-semibold ${
                    schema.changes.score.improvement
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {schema.changes.score.after}
                </span>
                <Badge
                  variant={
                    schema.changes.score.improvement ? 'success' : 'destructive'
                  }
                >
                  {schema.changes.score.delta > 0 ? '+' : ''}
                  {schema.changes.score.delta}
                </Badge>
              </div>
            </div>
            <Progress
              value={schema.changes.score.after}
              className="h-2"
            />
          </div>
        ) : null}

        {/* Completeness Changes */}
        {schema.changes.completeness ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Completeness</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {schema.changes.completeness.before}%
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <span
                  className={`text-sm font-semibold ${
                    schema.changes.completeness.improvement
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {schema.changes.completeness.after}%
                </span>
              </div>
            </div>
            <Progress
              value={schema.changes.completeness.after}
              className="h-2"
            />
          </div>
        ) : null}

        {/* Rich Results Eligibility */}
        {schema.changes.richResultsEligibility?.changed ? (
          <Alert
            variant={
              schema.changes.richResultsEligibility.improvement
                ? 'default'
                : 'destructive'
            }
          >
            <Award className="h-4 w-4" />
            <AlertTitle>Rich Results Eligibility</AlertTitle>
            <AlertDescription>
              {schema.changes.richResultsEligibility.improvement ? (
                <span className="text-green-700">
                  Schema is now eligible for Google Rich Results
                </span>
              ) : (
                <span className="text-red-700">
                  Schema lost Rich Results eligibility
                </span>
              )}
            </AlertDescription>
          </Alert>
        ) : null}

        {/* Error Changes */}
        {schema.changes.errors &&
        (schema.changes.errors.fixed.length > 0 ||
          schema.changes.errors.new.length > 0) ? (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Error Changes</h4>
            <div className="space-y-2">
              {schema.changes.errors.fixed.map((error, i) => (
                <div
                  key={`fixed-${i}`}
                  className="flex items-start gap-2 text-sm bg-green-50 p-2 rounded"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-900">Fixed</p>
                    <p className="text-green-700">
                      {error.property}: {error.message}
                    </p>
                  </div>
                </div>
              ))}
              {schema.changes.errors.new.map((error, i) => (
                <div
                  key={`new-${i}`}
                  className="flex items-start gap-2 text-sm bg-red-50 p-2 rounded"
                >
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-900">New Error</p>
                    <p className="text-red-700">
                      {error.property}: {error.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Warning Changes */}
        {schema.changes.warnings &&
        (schema.changes.warnings.fixed.length > 0 ||
          schema.changes.warnings.new.length > 0) ? (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Warning Changes</h4>
            <div className="space-y-2">
              {schema.changes.warnings.fixed.map((warning, i) => (
                <div
                  key={`fixed-${i}`}
                  className="flex items-start gap-2 text-sm bg-green-50 p-2 rounded"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-900">Fixed</p>
                    <p className="text-green-700">
                      {warning.property}: {warning.message}
                    </p>
                  </div>
                </div>
              ))}
              {schema.changes.warnings.new.map((warning, i) => (
                <div
                  key={`new-${i}`}
                  className="flex items-start gap-2 text-sm bg-yellow-50 p-2 rounded"
                >
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-900">New Warning</p>
                    <p className="text-yellow-700">
                      {warning.property}: {warning.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Property Changes */}
        {schema.changes.properties &&
        (schema.changes.properties.added.length > 0 ||
          schema.changes.properties.removed.length > 0 ||
          schema.changes.properties.modified.length > 0) ? (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Property Changes</h4>
            <div className="space-y-1 text-sm">
              {schema.changes.properties.added.map((prop, i) => (
                <div
                  key={`added-${i}`}
                  className="flex items-center gap-2 text-green-700"
                >
                  <Plus className="h-3 w-3" />
                  <span className="font-mono">{prop}</span>
                </div>
              ))}
              {schema.changes.properties.removed.map((prop, i) => (
                <div
                  key={`removed-${i}`}
                  className="flex items-center gap-2 text-red-700"
                >
                  <Minus className="h-3 w-3" />
                  <span className="font-mono">{prop}</span>
                </div>
              ))}
              {schema.changes.properties.modified.map((prop, i) => (
                <div
                  key={`modified-${i}`}
                  className="flex items-start gap-2 text-blue-700"
                >
                  <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-mono">{prop.property}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <code className="bg-red-50 text-red-700 px-1 py-0.5 rounded">
                        {String(prop.before)}
                      </code>
                      <ArrowRight className="h-3 w-3" />
                      <code className="bg-green-50 text-green-700 px-1 py-0.5 rounded">
                        {String(prop.after)}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Unchanged */}
        {schema.changeType === 'unchanged' ? (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              No significant changes detected in this schema
            </AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  );
}
