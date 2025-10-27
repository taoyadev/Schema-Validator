'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { SEOAnalysis, ImprovementSuggestion } from '@/lib/validation/types';
import {
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Zap,
  Clock,
  Target,
  Award,
} from 'lucide-react';

interface SEOAnalysisProps {
  analysis: SEOAnalysis;
}

export function SEOAnalysisComponent({ analysis }: SEOAnalysisProps) {
  return (
    <div className="space-y-6">
      {/* Overall Metrics */}
      <MetricsOverview metrics={analysis.metrics} />

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StrengthsCard strengths={analysis.strengths} />
        <WeaknessesCard weaknesses={analysis.weaknesses} />
      </div>

      {/* Completeness Breakdown */}
      <CompletenessCard breakdown={analysis.completenessBreakdown} />

      {/* Improvement Suggestions */}
      <SuggestionsCard suggestions={analysis.suggestions} />
    </div>
  );
}

function MetricsOverview({ metrics }: { metrics: SEOAnalysis['metrics'] }) {
  const metricsData = [
    {
      label: 'Required Fields',
      value: metrics.requiredFieldsScore,
      color: getScoreColor(metrics.requiredFieldsScore),
    },
    {
      label: 'Recommended Fields',
      value: metrics.recommendedFieldsScore,
      color: getScoreColor(metrics.recommendedFieldsScore),
    },
    {
      label: 'Technical SEO',
      value: metrics.technicalScore,
      color: getScoreColor(metrics.technicalScore),
    },
    {
      label: 'Content Quality',
      value: metrics.contentQualityScore,
      color: getScoreColor(metrics.contentQualityScore),
    },
    {
      label: 'Rich Results',
      value: metrics.richResultsReadiness,
      color: getScoreColor(metrics.richResultsReadiness),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">SEO Metrics</CardTitle>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            <span className="text-2xl font-bold">{metrics.overallScore}</span>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metricsData.map((metric) => (
            <div key={metric.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{metric.label}</span>
                <span className={`font-semibold ${metric.color}`}>
                  {metric.value}/100
                </span>
              </div>
              <Progress value={metric.value} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StrengthsCard({ strengths }: { strengths: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          Strengths
        </CardTitle>
      </CardHeader>
      <CardContent>
        {strengths.length > 0 ? (
          <ul className="space-y-2">
            {strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No strengths identified yet. Fix critical issues first.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function WeaknessesCard({ weaknesses }: { weaknesses: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          Areas for Improvement
        </CardTitle>
      </CardHeader>
      <CardContent>
        {weaknesses.length > 0 ? (
          <ul className="space-y-2">
            {weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <TrendingDown className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Great! No significant weaknesses detected.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function CompletenessCard({
  breakdown,
}: {
  breakdown: SEOAnalysis['completenessBreakdown'];
}) {
  const categories = [
    { label: 'Required Fields', data: breakdown.required, color: 'text-red-600' },
    {
      label: 'Recommended Fields',
      data: breakdown.recommended,
      color: 'text-yellow-600',
    },
    { label: 'Optional Fields', data: breakdown.optional, color: 'text-blue-600' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Field Completeness</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{category.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {category.data.completed}/{category.data.total}
                  </span>
                  <span className={`font-semibold ${category.color}`}>
                    {category.data.percentage}%
                  </span>
                </div>
              </div>
              <Progress value={category.data.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SuggestionsCard({
  suggestions,
}: {
  suggestions: ImprovementSuggestion[];
}) {
  const groupedSuggestions = groupByPriority(suggestions);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Improvement Suggestions</CardTitle>
        <p className="text-sm text-muted-foreground">
          Prioritized recommendations to boost your SEO score
        </p>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Excellent! No improvements needed.
          </p>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSuggestions).map(([priority, items]) => (
              <div key={priority}>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <PriorityBadge priority={priority as ImprovementSuggestion['priority']} />
                  <span className="text-sm text-muted-foreground">
                    ({items.length})
                  </span>
                </h4>
                <div className="space-y-3">
                  {items.map((suggestion) => (
                    <SuggestionCard
                      key={suggestion.id}
                      suggestion={suggestion}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SuggestionCard({ suggestion }: { suggestion: ImprovementSuggestion }) {
  return (
    <div className="border rounded-lg p-4 space-y-3 hover:bg-accent/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h5 className="font-medium text-sm mb-1">{suggestion.title}</h5>
          <p className="text-sm text-muted-foreground">
            {suggestion.description}
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <EffortBadge effort={suggestion.effort} />
          <ImpactBadge impact={suggestion.impact} />
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Target className="h-3 w-3" />
          <span>{suggestion.estimatedImpact}</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="h-3 w-3" />
          <span>Property: {suggestion.property}</span>
        </div>
      </div>

      <div className="bg-muted/50 rounded p-3 text-sm">
        <span className="font-medium">Fix: </span>
        <code className="text-xs">{suggestion.fix}</code>
      </div>

      {suggestion.documentation ? (
        <a
          href={suggestion.documentation}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
        >
          View documentation →
        </a>
      ) : null}
    </div>
  );
}

function PriorityBadge({ priority }: { priority: ImprovementSuggestion['priority'] }) {
  const config = {
    critical: { label: 'Critical', className: 'bg-red-100 text-red-700' },
    high: { label: 'High Priority', className: 'bg-orange-100 text-orange-700' },
    medium: { label: 'Medium Priority', className: 'bg-yellow-100 text-yellow-700' },
    low: { label: 'Low Priority', className: 'bg-blue-100 text-blue-700' },
  };

  const { label, className } = config[priority];

  return <Badge className={className}>{label}</Badge>;
}

function EffortBadge({ effort }: { effort: ImprovementSuggestion['effort'] }) {
  const config = {
    low: { label: 'Quick Fix', className: 'bg-green-100 text-green-700' },
    medium: { label: 'Medium Effort', className: 'bg-yellow-100 text-yellow-700' },
    high: { label: 'Complex', className: 'bg-red-100 text-red-700' },
  };

  const { label, className } = config[effort];

  return (
    <Badge variant="outline" className={`text-xs ${className}`}>
      <Clock className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  );
}

function ImpactBadge({ impact }: { impact: ImprovementSuggestion['impact'] }) {
  const config = {
    high: { label: 'High Impact', className: 'bg-purple-100 text-purple-700' },
    medium: { label: 'Med Impact', className: 'bg-blue-100 text-blue-700' },
    low: { label: 'Low Impact', className: 'bg-gray-100 text-gray-700' },
  };

  const { label, className } = config[impact];

  return (
    <Badge variant="outline" className={`text-xs ${className}`}>
      {label}
    </Badge>
  );
}

// Helper functions

function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-600';
  if (score >= 75) return 'text-blue-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-600';
}

function groupByPriority(suggestions: ImprovementSuggestion[]): Record<
  string,
  ImprovementSuggestion[]
> {
  const grouped: Record<string, ImprovementSuggestion[]> = {
    critical: [],
    high: [],
    medium: [],
    low: [],
  };

  suggestions.forEach((suggestion) => {
    grouped[suggestion.priority].push(suggestion);
  });

  // Remove empty groups
  Object.keys(grouped).forEach((key) => {
    if (grouped[key].length === 0) {
      delete grouped[key];
    }
  });

  return grouped;
}
